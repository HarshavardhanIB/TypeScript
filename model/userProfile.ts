import { Schema, model, connect } from 'mongoose';
interface userProfile{
    user_id:Number;
    first_name:String;
    last_name:String;
    profile_pic:String;
    created_on:Date;
    updated_on:Date;
}
const userschema = new Schema({
    user_id:{type:Number,required: true,},
    first_name: { type: String, required: true,min:2, max : 25 },
    last_name: { type: String, required: true, max: 30 },
    profile_pic: { type: String, required: true, max: 100 },
    created_on: { type: Date,default:Date.now },
    updated_on: { type: Date,default:Date.now },
});
const userDetails=model<userProfile>('user_details',userschema);
export default userDetails;