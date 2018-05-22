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
const FlakeIdGen = require("flake-idgen");
const typedi_1 = require("typedi");
const int64_buffer_1 = require("int64-buffer");
let IdGenShowFlake = class IdGenShowFlake {
    constructor() {
        this.idGen = new FlakeIdGen();
    }
    take() {
        const idBuff = this.idGen.next();
        return new int64_buffer_1.Uint64BE(idBuff).toString();
    }
    withTime() {
        return {
            id: this.take(),
        };
    }
};
IdGenShowFlake = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], IdGenShowFlake);
exports.IdGenShowFlake = IdGenShowFlake;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25vd19mbGFrZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvaWQvc25vd19mbGFrZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLDBDQUEwQztBQUMxQyxtQ0FBaUM7QUFDakMsK0NBQXVDO0FBR3ZDLElBQWEsY0FBYyxHQUEzQjtJQUlFO1FBQ0UsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO0lBQ2hDLENBQUM7SUFFRCxJQUFJO1FBQ0YsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNqQyxPQUFPLElBQUksdUJBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBRUQsUUFBUTtRQUNOLE9BQU87WUFDTCxFQUFFLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRTtTQUVoQixDQUFBO0lBQ0gsQ0FBQztDQUNGLENBQUE7QUFuQlksY0FBYztJQUQxQixnQkFBTyxFQUFFOztHQUNHLGNBQWMsQ0FtQjFCO0FBbkJZLHdDQUFjIn0=