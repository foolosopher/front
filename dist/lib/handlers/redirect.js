"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("@app/constants");
exports.baseRedirect = (msg) => {
    if (msg.data.to) {
        return {
            code: constants_1.STATUS_TEMP_REDIR,
            location: msg.data.to
        };
    }
    else {
        return {
            code: constants_1.STATUS_BAD_REQUEST,
            error: 'Parameter "to" is required'
        };
    }
};
//# sourceMappingURL=redirect.js.map