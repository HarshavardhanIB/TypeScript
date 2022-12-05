import { Response, Request, NextFunction } from "express";
import { emailvalidation, AlphaNumberorNot, isAlphaorNot, lengthVerification, autogenerateKey } from '../services/validation.services';
import * as bcrypt from 'bcryptjs';
import * as constants from '../services/constants';
import dotenv from "dotenv";
import * as date from 'date-and-time';
import * as messages from '../services/messges';
import * as jwt from 'jsonwebtoken';
import User from '../model/user.model';
import mail from '../services/email.services';
import { Console, error } from "console";
import apierr from '../middleware/apierr.middleware';
import userDetails from '../model/userProfile.model';
import * as middleware from '../middleware/verifyToken.middleware';
import * as userRepo from '../repositories/user.repository';
import * as projectRepo from '../repositories/project.repository';
import * as UserDetaRepo from '../repositories/userDetails.repository';
dotenv.config();
const dataBase: any = process.env.DATABASE;
interface user {
    userName: string;
    emailid: string;
    password: string;
    roleId: number;
}
const emailId = process.env.EMAIL_ID;
export async function registration(req: Request, res: Response, next: NextFunction) {
    try {

        const { userName, emailid, password, roleId } = req.body;
        let active = 0;
        let now = new Date();
        let currentDateAndTime = date.format(now, 'YYYY-MM-DD HH:mm:ss');
        if (!userName || !emailid || !password || !roleId) {
            next(apierr.badReq("enter valid input"));
        }
        let emailIdcheckStatus = await emailvalidation(emailid);
        if (emailIdcheckStatus == false) {
            console.log("email id error");
            next(apierr.badReq("in valid mail id"));
        }
        let userNameValidation = await AlphaNumberorNot(userName);
        if (userNameValidation == false) {
            next(apierr.badReq(messages.enterAlpha));
        }
        let userNamelengthValidation = await lengthVerification(userName, 2, 20);
        if (userNamelengthValidation == false) {
            next(apierr.badReq(messages.UNRange))
        }
        if (dataBase == "MONGO") {
            let mailcount: number = await User.find({ emailid: emailid }).count();
            if (mailcount > 0) {
                next(apierr.badReq(messages.EIexists));
                return;
            }
            let userNameCount: number = await User.find({ userName: userName }).count();
            if (userNameCount > 0) {
                next(apierr.badReq(messages.UNexists));
                return res;
            }
        }
        else {
            // let mailcount:any = await User.findById({ emailid: emailid });
            var mailcount: any = await userRepo.findById({ id: emailid });
            if (mailcount.length > 0) {
                console.log("mail coyunt enter");
                next(apierr.badReq(messages.EIexists));
                return res;
            }
            var unCount: any = await userRepo.findById({ id: userName })
            if (unCount.length > 0) {
                next(apierr.badReq(messages.UNexists));
                return res;
            }
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
        if (dataBase == "MONGO") {

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
                // console.log(error.stack);
                next(apierr.badReq("eroor while insert the data "));
            })
        }
        else {
            userRepo.save(user).then(user => {
                // user.save().then(user => {
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
                // console.log(error.stack);
                next(apierr.badReq("eroor while insert the data "));
            })
        }
    }
    catch (error) {
        // console.log(error);
    }
}
export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { userName, password } = req.body;
        // console.log(req.body);
        if (!userName || !password) {
            next(apierr.badReq("enter valid input"));
        }
        let secret = process.env.SECRET;
        if (dataBase == "MONGO") {
            await User.findOne({ $or: [{ email: userName }, { UserName: userName }] }).then(user => {
                if (user) {
                    // const passwordHash = bcrypt.hashSync(password, 10);
                    bcrypt.compare(password, user.password, async function (error, result) {
                        if (error) {
                            res.status(201).json(
                                {
                                    "statusCode": 201,
                                    "message": messages.invalidUSandPsw
                                }
                            )
                            return res;
                        }
                        // console.log(result);
                        if (result) {
                            console.log(user);
                            if (user.active == 0) {
                                res.status(202).json({
                                    "statusCode": 202,
                                    "message": messages.checkMail
                                })
                            }
                            let accessToken = jwt.sign({ userid: user._id, roleId: user.roleId }, constants.secret, { expiresIn: constants.expiresIn, algorithm: constants.algorithm });
                            if (user.roleId == 1) {
                                let adminCount: number = await User.find({ roleId: 1 }).count();
                                let userCount: number = await User.find({ roleId: 2 }).count();
                                let total: number = adminCount + userCount;
                                let count: any = { "users": userCount, "admins": adminCount, "total": total };
                                let data: any = { "userName": user.userName, "userId": user._id, "roleId": user.roleId, "accessToken": accessToken, "count": count };
                                res.status(200).json(
                                    {
                                        "statusCode": 200,
                                        "message": messages.loginSuccess,
                                        data
                                    })
                            }
                            else {
                                let data: any = { "userName": user.userName, "userId": user._id, "roleId": user.roleId, "accessToken": accessToken }
                                res.status(200).json(
                                    {
                                        "statusCode": 200,
                                        "message": messages.loginSuccess,
                                        data
                                    })
                            }
                        }
                        else {
                            res.status(201).json(
                                {
                                    "statusCode": 201,
                                    "message": messages.invalidUSandPsw
                                }
                            )
                            return res;
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
        else {
            // usre.findOne({ $or: [{ email: userName }, { UserName: userName }] }).then(user => {
            userRepo.findOne({ email: userName, UserName: userName }).then(user => {
                // console.log(user);
                // await User.findOne({ $or: [{ email: userName }, { UserName: userName }] }).then(user => {
                if (user) {
                    // const passwordHash = bcrypt.hashSync(password, 10);
                    bcrypt.compare(password, user[0].password, async function (error, result) {
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
                        else if (result) {
                            console.log(user);
                            if (user[0].active == 0) {
                                res.status(202).json({
                                    "statusCode": 202,
                                    "message": messages.checkMail
                                })
                            }
                            let accessToken = jwt.sign({ userid: user[0].id, roleid: user[0].role_id }, constants.secret, { expiresIn: constants.expiresIn, algorithm: constants.algorithm });
                            if (user[0].roleId == 1) {
                                // let adminCount: number = await User.find({ roleId: 1 }).count();
                                // let userCount: number = await User.find({ roleId: 2 }).count();
                                let adminCount = await userRepo.findCount({ id: 1 });
                                let userCount = await userRepo.findCount({ id: 2 });
                                let total: number = adminCount + userCount;
                                let count: any = { "users": userCount, "admins": adminCount, "total": total };
                                let data: any = { "userName": user[0].user_name, "userId": user[0].id, "roleId": user[0].role_id, "accessToken": accessToken, "count": count };
                                res.status(200).json(
                                    {
                                        "statusCode": 200,
                                        "message": messages.loginSuccess,
                                        data
                                    })
                            }
                            else {
                                let data: any = { "userName": user[0].user_name, "userId": user[0].id, "roleId": user[0].role_id, "accessToken": accessToken, }
                                res.status(200).json(
                                    {
                                        "statusCode": 200,
                                        "message": messages.loginSuccess,
                                        data
                                    })
                            }
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
        let key: any = req.query.key;
        key.replace(/\s/g, "");
        let update = { key: key };
        let active = { $set: { active: 1 } }
        let resultforId: any = await User.updateOne(update, active);
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
        else {
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
        next(apierr.badReq(messages.activationError));
    }
}