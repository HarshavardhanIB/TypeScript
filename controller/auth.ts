import { Response, Request, NextFunction } from "express";
import { emailvalidation, AlphaNumberorNot, isAlphaorNot, lengthVerification, autogenerateKey } from './validation';
import * as bcrypt from 'bcryptjs';
import * as constants from '../controller/constants';
import dotenv from "dotenv";
import * as date from 'date-and-time';
import * as messages from '../controller/messges';
import * as jwt from 'jsonwebtoken';
import User from '../model/user';
import mail from '../controller/email';
import { error } from "console";
import apierr from '../errorHandler/apierr';
dotenv.config();
interface user {
    userName: string;
    emailid: string;
    password: string;
    roleId: number;
}
const emailId = process.env.EMAIL_ID;
export async function registration(req: Request, res: Response, next: NextFunction) {
    try {
        console.log(req.body);
        const { userName, emailid, password, roleId } = req.body;
        let active = 0;
        let now = new Date();
        let currentDateAndTime = date.format(now, 'YYYY-MM-DD HH:mm:ss');
        if (!userName || !emailid || !password || !roleId) {
            next(apierr.badReq("enter valid input"));
        }
        console.log(userName + emailid + password + roleId)
        let emailIdcheckStatus = await emailvalidation(emailid);
        if (emailIdcheckStatus == false) {
            console.log("email id error");
            next(apierr.badReq("in valid mail id"));
        }
        let userNameValidation = await AlphaNumberorNot(userName);
        if (userNameValidation == false) {
            next(apierr.badReq("Enter User name alpha numaric values only"));
        }
        let userNamelengthValidation = await lengthVerification(userName, 2, 20);
        if (userNamelengthValidation == false) {
            next(apierr.badReq("enter the user name in between 2 and 20 characters only"))
        }
        let mailcount:number =await User.find({emailid:emailid}).count();
        if(mailcount>0)
        {
            next(apierr.badReq(messages.EIexists));
            return;
        }
        let userNameCount:number =await User.find({userName: userName}).count();
        if(userNameCount>0)
        {
            next(apierr.badReq(messages.UNexists));
            return res;
        }
        const passwordHash = bcrypt.hashSync(password, 10);
        let key = await autogenerateKey(19);
        let user = new User(
            {
                roleId: roleId,
                userName: userName,
                emailid: emailid,
                password: passwordHash,
                active: active,
                key: key,
                create_date_and_time: currentDateAndTime,
                update_date_and_time: currentDateAndTime
            });
        console.log()
        user.save().then(user => {
            const emailIdformail: string = "harshavardhan.kadupu@ideabytes.com";
            let HTMLcontentFile = process.env.APP_URL + "/user_activation.html?key=" + key;
            let htmlContent = `<h2>Hello ${userName}</h2> 
                <p>Thank you for register in ADMIN PORTAL</p>
                <a href="${HTMLcontentFile}"> Click here to activate </a>`;
            mail(emailIdformail, emailid, "Admin Portal Registation Successfully", htmlContent, "User registered Successfully", "");
            res.status(200).json({
                "statusCode": 200,
                "message": "user register successfully"
            })
        }).catch(error => {
            console.log(error.stack);
            next(apierr.badReq("eroor while insert the data "));
        })
    }
    catch (error) {
        console.log(error);
    }
}
export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { userName, password } = req.body;
        console.log(req.body);
        if (!userName || !password) {
            next(apierr.badReq("enter valid input"));
        }
        let secret = process.env.SECRET;
        await User.findOne({ $or: [{ email: userName }, { UserName: userName }] }).then(user => {
            if (user) {
                // const passwordHash = bcrypt.hashSync(password, 10);
                bcrypt.compare(password, user.password, function (error,result) {
                    if (error) {
                        res.status(201).json(
                            {
                                "statusCode": 201,
                                "message": messages.invalidUSandPsw
                            }
                        )
                        return res;
                        return;
                    }
                    console.log(result);
                    if (result) {
                        console.log(user);
                        if (user.active == 0) {
                            res.status(202).json({
                                "statusCode": 202,
                                "message": messages.checkMail
                            })
                        }
                        let accessToken = jwt.sign({ userid: user._id, roleid: user.roleId }, constants.secret, { expiresIn: constants.expiresIn, algorithm: constants.algorithm });
                        res.status(200).json(
                            {
                                "statusCode": 200,
                                "message": messages.loginSuccess,
                                accessToken
                            })
                    }
                    else {
                        res.status(201).json(
                            {
                                "statusCode": 201,
                                "message": messages.invalidUSandPsw
                            }
                        )
                        return res;
                        return;
                    }

                })

            }
            else {
                res.status(201).json(
                    {
                        "statusCode": 201,
                        "message": messages.invalidUSandPsw

                    }
                )
            }
        })
    }
    catch (error) {
        console.error(error);
        console.log("==============================error========================");
        next(apierr.badReq("check the keys"));

    }
}
export async function activate(req: Request, res: Response, next: NextFunction) {
    try {
        console.log(req);
        console.log(req.query);
        let key:any = req.query.key;
        key.replace(/\s/g, "");
        let update={key:key};
        let active={ $set: { active:1 } }
        let resultforId:any=await User.updateOne(update,active);
       
        if (resultforId.length == 0) {
            let responseData =
            {
                "statusCode": 202,
                "message": messages.invalidKey,
            };
            const jsonContent = JSON.stringify(responseData);
            res.status(202).end(jsonContent);
            return res;
        }
        else{
            let responseData =
        {
            "statusCode": 200,
            "message": messages.userActivation
        };
        const jsonContent = JSON.stringify(responseData);
        res.status(200).end(jsonContent);
        return res;
        }   
        
    }
    catch (error) {
       next(apierr.badReq("error while activate your account"));
    }
}