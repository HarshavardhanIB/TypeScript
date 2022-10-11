"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userschema = new mongoose_1.Schema({
    user_id: { type: Number, required: true, },
    first_name: { type: String, required: true, min: 2, max: 25 },
    last_name: { type: String, required: true, max: 30 },
    profile_pic: { type: String, required: true, max: 100 },
    created_on: { type: Date, default: Date.now },
    updated_on: { type: Date, default: Date.now },
});
const userDetails = (0, mongoose_1.model)('user_details', userschema);
exports.default = userDetails;
