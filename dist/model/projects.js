"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const project = new mongoose_1.Schema({
    project_name: { type: String, required: true, min: 2, max: 25 },
    project_version: { type: String, required: true, min: 2, max: 25 },
    created_by: { type: String, required: true },
    created_on: { type: Date, default: Date.now },
    updated_on: { type: Date, default: Date.now }
});
const projects = (0, mongoose_1.model)('projects', project);
exports.default = projects;
