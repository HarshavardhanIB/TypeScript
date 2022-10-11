import { Schema, model, connect } from 'mongoose';

interface user {
    userName:string;
    emailid :string;
    password :string;
    roleId:number;
    active:number;
    key:string;
    create_date_and_time:Date;
    update_date_and_time:Date;
}

const userSchema = new Schema<user>({
    roleId:{type:Number,required: true},
    userName:{type: String,required:true},
    emailid:{ type: String, required: true, max: 30 },
    password:{ type: String, required: true, max: 100 },
    active:{type:Number,required: true},
    key:{type: String, required: true, max: 20},
    create_date_and_time: { type: Date,default:Date.now },
    update_date_and_time: { type: Date,default:Date.now },
});
const User = model<user>('User', userSchema);
export default User; 