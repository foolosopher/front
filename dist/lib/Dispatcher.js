"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const lib_1 = require("@app/lib");
const constants_1 = require("@app/constants");
const helpers_1 = require("@app/helpers");
const rock_me_ts_1 = require("rock-me-ts");
const redirect_1 = require("@app/lib/handlers/redirect");
let Dispatcher = class Dispatcher {
    constructor() {
        this.enrichBus = new lib_1.TreeBus();
        this.listenBus = new lib_1.TreeBus();
        this.handleBus = new lib_1.FlatBus();
        this.rpcHandlers = {};
        this.rpcGateway = async (key, msg) => {
            if (msg.service && msg.name && this.rpcHandlers[key]) {
                const res = await this.rpc.request(msg.service, msg.name, msg);
                if (res.code && typeof res.code === 'number' && res.result) {
                    return res;
                }
                else {
                    return {
                        result: res,
                        code: constants_1.STATUS_OK
                    };
                }
            }
            return this.defaultHandler(key, msg);
        };
        this.defaultHandler = async (key, msg) => {
            return {
                code: constants_1.STATUS_OK,
                result: {
                    key: key,
                    id: msg.id
                }
            };
        };
        this.log = typedi_1.Container.get(rock_me_ts_1.Logger).for(this);
        this.log.info('Starting');
        this.appConfig = typedi_1.Container.get(rock_me_ts_1.AppConfig);
        this.idGen = typedi_1.Container.get(rock_me_ts_1.TheIds);
    }
    setup() {
        this.handleBus.setNoneHdr(this.defaultHandler);
        const redisFactory = typedi_1.Container.get(rock_me_ts_1.RedisFactory);
        const meter = typedi_1.Container.get(rock_me_ts_1.Meter);
        const channels = [this.appConfig.rpc.name];
        // Setup RPC
        const rpcOptions = { channels, redisFactory, log: this.log, meter, ...this.appConfig.rpc };
        const rpcAdaptor = new rock_me_ts_1.RPCAdapterRedis(rpcOptions);
        this.rpc = new rock_me_ts_1.RPCAgnostic(rpcOptions);
        this.rpc.setup(rpcAdaptor);
        this.rpc.register(rock_me_ts_1.METHOD_STATUS, async (data) => {
            if (data.methods) {
                const updateHdrs = [];
                console.log(typeof data.methods);
                console.log(Array.isArray(data.methods));
                console.dir(data.methods);
                for (const row of data.methods) {
                    const [name, method, role] = row;
                    const key = helpers_1.epglue(constants_1.IN_INDEP, name, method);
                    if (role === 'handler') {
                        this.rpcHandlers[key] = [name, method];
                        updateHdrs.push(key);
                    }
                }
                this.handleBus.replace(updateHdrs, this.rpcGateway);
            }
            return { 'status': rock_me_ts_1.STATUS_RUNNING };
        });
        // this.rpc.register<{ methods?: Array<[string, string, string]> }>('services', async (data) => {
        //   return { result: true };
        // });
        this.handleBus.handle(constants_1.IN_REDIR, redirect_1.baseRedirect);
        // notify band director
        setImmediate(() => {
            this.rpc.notify(constants_1.SERVICE_DIRECTOR, constants_1.RPC_IAMALIVE, { name: constants_1.SERVICE_FRONTIER });
        });
        this.listenBus.subscribe('*', async (key, msg) => {
            try {
                return await this.rpc.notify(constants_1.BROADCAST, constants_1.BROADCAST, msg);
            }
            catch (error) {
                this.log.error(`catch! ${error.message}`);
            }
        });
    }
    start() {
        this.log.info('Started');
    }
    registerEnricher(key, func) {
        this.log.info(`Registering enricher for ${key}`);
        this.enrichBus.subscribe(key, func);
    }
    registerListener(key, func) {
        this.log.info(`Registering subscriber for ${key}`);
        this.listenBus.subscribe(key, func);
    }
    registerHandler(key, func) {
        this.handleBus.set(key, func);
    }
    async emit(key, msg) {
        this.log.debug(` -> ${key}`);
        msg.id = this.idGen.flake();
        msg.time = Number(new Date());
        // ### Phase 1: enriching
        const enrichments = await this.enrichBus.publish(key, msg);
        if (enrichments.length) {
            msg = Object.assign(msg, ...enrichments);
        }
        // ### Phase 2: deliver to listeners
        this.listenBus.publish(key, msg).then(results => { });
        // ### Phase 3: handling if configuring
        return await this.handleBus.handle(key, msg);
    }
};
Dispatcher = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], Dispatcher);
exports.Dispatcher = Dispatcher;
//# sourceMappingURL=Dispatcher.js.map