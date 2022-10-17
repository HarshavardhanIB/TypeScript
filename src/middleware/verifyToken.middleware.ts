import { Response, Request, NextFunction } from "express";
import { type } from "os";
import * as constants from '../services/constants.services';
import * as message from '../services/messges.services';
import * as jwt from 'jsonwebtoken';
import dotenv from "dotenv";
export let userid:number;
export let roleId:number;
dotenv.config();
export async function verifyToken(req:Request,res:Response,next:NextFunction) {
    type algorith="HS512";
    console.log("enter");
    console.log(req.path);
    let reqPath = req.path;
    let adminOrUser= reqPath.split("/")[2];
    if(reqPath.split("/")[3]=="appInfo")
    {
        next();
    }
    console.log(adminOrUser);
    if (adminOrUser == "admin" || adminOrUser == "user") {
        console.log("entered 2");
        try {
            const authorizationKey:any= req.headers['authorization'];
            if (!authorizationKey) {
                let responseData =
                {
                    "statusCode": 500,
                    "message": message.tokenUnauthorized
                };
                const jsonContent = JSON.stringify(responseData);
                res.status(500).end(jsonContent);
                return res;
            }
            var token = authorizationKey.split(" ")[1];
            var decoded =jwt.verify(token,constants.secret);
            console.log(decoded);
            userid = await (<any>decoded).userid
            roleId = await (<any>decoded).roleid;
            console.log(userid);
            console.log(roleId);
            console.log(adminOrUser);
            console.log(roleId);
            if (adminOrUser == "admin" && roleId == 1) {
                next();
            }
            else if (adminOrUser == "user" && roleId == 2) {
                next();
            }
            else {
                let responseData =
                {
                    "statusCode": 401,
                    "message": message.invalidRolePath
                };
                const jsonContent = JSON.stringify(responseData);
                res.status(401).end(jsonContent);
                return res;
            }
        }
        catch (error:any) {
            let message = "";
            if (error.name == "TokenExpiredError") {
                message = error.message;
            }
            else if (error.name == "JsonWebTokenError") {
                message = error.message;
            }
            else {
                message = error.message;
            }
            console.log(error.message);
            let responseData =
            {
                "statusCode": 401,
                "message": message,
            };
            const jsonContent = JSON.stringify(responseData);
            res.status(401).end(jsonContent);
            return res;            
        }
    }
    else {
        next();
    }
    
}
