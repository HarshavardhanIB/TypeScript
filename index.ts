import express,{ Express,Request,Response } from "express";
import dotenv from "dotenv";
import bodyparser from 'body-parser';
import auth from './routes/authRouter';
import admin from './routes/admin';
import user from './routes/user';
import {connect} from './model/mongodb';
import apiErrHandler from './errorHandler/apiErrHandler';
import * as middlewhere  from './middleWhereFunction/middleWhereFunction'
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
app.use("/auth",auth);
app.use("/admin",admin);
app.use("/user",user);
app.use(apiErrHandler);
app.listen(port,()=>
{
  console.log(`the app is running on the port ${port}`);
  connect();
})