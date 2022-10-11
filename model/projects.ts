import { Schema, model, connect } from 'mongoose';

interface user {
    project_name:String;
    project_version: String;
    created_by:String;
    created_on:Date;
    updated_on: Date;
}

const project = new Schema<user>({
    project_name:{type: String, required: true,min:2, max : 25},
    project_version: { type: String, required: true,min:2, max : 25 },
    created_by: { type: String, required: true},
    created_on: { type: Date,default:Date.now  },
    updated_on: { type: Date,default:Date.now }
});
const projects = model<user>('projects', project);
export default projects; 