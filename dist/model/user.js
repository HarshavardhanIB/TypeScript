"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    roleId: { type: Number, required: true },
    userName: { type: String, required: true },
    emailid: { type: String, required: true, max: 30 },
    password: { type: String, required: true, max: 100 },
    active: { type: Number, required: true },
    key: { type: String, required: true, max: 20 },
    create_date_and_time: { type: Date, default: Date.now },
    update_date_and_time: { type: Date, default: Date.now },
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
