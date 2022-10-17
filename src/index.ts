import express,{ Express,Request,Response } from "express";
import dotenv from "dotenv";
import bodyparser from 'body-parser';
import auth from './routes/auth.router';
import admin from './routes/admin.router';
import user from './routes/user.touter';
import {connect} from './dbConnection/mongodb';
import apiErrHandler from './middleware/apiErrHandler.middleware';
import * as middlewhere  from './middleware/verifyToken.middleware'
dotenv.config();
const app: Express=express();
const port=process.env.PORT;
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.get('/',(req:Request,res:Response)=>
{
  res.send("express");
})
app.use(middlewhere.verifyToken);
app.use("/api/auth",auth);
app.use("/api/admin",admin);
app.use("/api/user",user);
app.use(apiErrHandler);
app.listen(port,()=>
{
  console.log(`the app is running on the port ${port}`);
  connect();
})