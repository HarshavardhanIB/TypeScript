import mongoose from 'mongoose';
import { nextTick } from 'process';
export const connect = async () => {
		const uri:any =process.env.DB;
	await mongoose.connect(uri,{
		family: 4,

		}).then(()=>{
		console.log("db connected");
	}).catch(error=>
		{console.log(error);})
	};

