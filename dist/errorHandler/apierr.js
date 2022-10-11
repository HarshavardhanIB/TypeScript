"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class apierr {
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }
    static badReq(msg) {
        return new apierr(400, msg);
    }
    static internal(msg) {
        return new apierr(500, msg);
    }
}
exports.default = apierr;
