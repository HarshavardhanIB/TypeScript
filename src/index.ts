import express,{ Express,Request,Response } from "express";
import { CorsOptions } from "cors";
import cors from 'cors';
import dotenv from "dotenv";
import bodyparser from 'body-parser';
import auth from './routes/auth.router';
import admin from './routes/admin.router';
import user from './routes/user.touter';
import test from './routes/test.router';
import path from "path";
import {connect} from './dbConnection/mongodb';
import apiErrHandler from './middleware/apiErrHandler.middleware';
import * as middlewhere  from './middleware/verifyToken.middleware';
dotenv.config();
const app: Express=express();
app.use(express.json());
app.use('/images', express.static(path.resolve(__dirname,'../public/resources/images')));
app.use('/logfile',express.static(path.resolve(__dirname,'../public/resources/logfile')));
const port=process.env.PORT;
const Options:cors.CorsOptions={
  origin: '*',
}
app.use(cors(Options))
app.use(middlewhere.corsFunction)
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.get('/',(req:Request,res:Response)=>
{
  res.send("express"); 
})
app.use(middlewhere.verifyToken);
app.use("/api/test",test);
app.use("/api/auth",auth);
app.use("/api/admin",admin);
app.use("/api/user",user);
app.use(apiErrHandler);
app.listen(port,()=>
{
  console.log(`the app is running on the port ${port}`);
  // connect();
})