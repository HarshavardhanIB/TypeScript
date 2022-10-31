import * as messages from '../services/messges.services';
import * as validation from '../services/validation.services';
import projects from '../model/projects.model';
import userDetails from '../model/userProfile.model';
import user from '../model/user.model';
import * as middlewhere from '../middleware/verifyToken.middleware';
import * as date from 'date-and-time';
import * as fs from 'fs';
import * as cron from 'node-cron';
import { readFile, writeFile } from 'fs/promises';
import * as constants from '../services/constants.services'
import express, { Response, Request, NextFunction } from "express";
import apierr from '../middleware/apierr.middleware';
import { IncomingMessage } from 'http';
import * as formidable from 'formidable';
import mail from '../services/email.services';
import * as userRepo from '../repositories/user.repository';
import * as projectRepo from '../repositories/project.repository';
import * as UserDetaRepo from '../repositories/userDetails.repository';
import { generateExcel } from '../services/excel.services'
let responseData: any;
let jsonContent: any;
const dataBase: any = process.env.DATABASE;
console.log(dataBase);
interface project {
    project_name: string;
    project_version: string;
}
interface userProfile {
    firstName: string;
    lastName: string;
}
export async function postproject(req: Request, res: Response, next: NextFunction) {
    let now = new Date();
    let currentDateAndTime = date.format(now, 'YYYY-MM-DD HH:mm:ss');
    const { project_name, project_version } = req.body;
    if (!project_name || !project_version) {
        res.status(201).json({
            "statusCode": 201,
            "message": messages.validinput
        })
    }
    else {
        let project = new projects({
            project_name: project_name,
            project_version: project_version,
            created_by: middlewhere.userid,
            created_on: currentDateAndTime,
            updated_on: currentDateAndTime
        });
        if (dataBase == "MONGO") {
            project.save().then(project => {
                res.status(200).json({
                    "statusCode": 200,
                    "message": messages.insertProjects
                })
                res.end();
                return res;
            }).catch(e => {
                console.log(e.stack);
                next(apierr.badReq(messages.errorData));
            })
        }
        else {
            projectRepo.save(project).then(project => {
                // project.save().then(project => {
                res.status(200).json({
                    "statusCode": 200,
                    "message": messages.insertProjects
                })
                res.end();
                return res;
            }).catch(e => {
                console.log(e.stack);
                next(apierr.badReq(messages.errorData));
            })

        }

    }

}
export async function putProject(req: Request, res: Response, next: NextFunction) {

    const { project_name, project_version } = req.body;
    const id = req.query.id;
    if (!project_name || !project_version || !id) {
        res.status(201).json({
            "statusCode": 201,
            "message": messages.validinput
        })
    }
    else {
        let now = new Date();
        let currentDateAndTime = date.format(now, 'YYYY-MM-DD HH:mm:ss');
        let updateusingId = { created_by: id };
        let updatingValues = {
            project_name: project_name,
            project_version: project_version,
            updated_on: currentDateAndTime
        }
        if (dataBase == "MONGO") {
            await projects.findOneAndUpdate(updateusingId, updatingValues).then(result => {
                if (result) {
                    res.status(200).json({
                        "statusCode": 200,
                        "message": messages.updateProject
                    })
                }
                else {
                    res.status(200).json({
                        "statusCode": 200,
                        "message": messages.QueryError
                    })
                }
            }).catch(err => {
                res.status(500).json({
                    "statusCode": 500,
                    "message": messages.QueryError
                })
            })
        }

        else {
            // await projects.findOneAndUpdate(updateusingId, updatingValues).then(result => {
            projectRepo.findOneAndUpdate(updateusingId, updatingValues, next).then(result => {
                if (result) {
                    res.status(200).json({
                        "statusCode": 200,
                        "message": messages.updateProject
                    })
                }
                else {
                    res.status(200).json({
                        "statusCode": 200,
                        "message": messages.QueryError
                    })
                }
            }).catch(err => {
                res.status(500).json({
                    "statusCode": 500,
                    "message": messages.QueryError
                })
            })
        }
    }

}
export async function deleteProject(req: Request, res: Response, next: NextFunction) {
    const id = req.query.id;
    if (!id) {
        res.status(201).json({
            "statusCode": 201,
            "message": messages.validinput
        })
    }
    else {
        if (dataBase == "MONGO") {
            let deleteUsingId = { id: id };
            projects.deleteOne(deleteUsingId).then(result => {
                res.status(200).json({
                    "statusCode": 200,
                    "message": messages.deletedProject
                })
            }).catch(err => {
                next(apierr.badReq(messages.projectDelete));
            })
        }
        else {
            let deleteUsingId = { id: id };
            // projects.deleteOne(deleteUsingId).then(result => {
            projectRepo.deleteOne({ id: id }).then(result => {
                res.status(200).json({
                    "statusCode": 200,
                    "message": messages.deletedProject
                })
            }).catch(err => {
                next(apierr.badReq(messages.projectDelete));
            })
        }
    }
}
export async function getProjects(req: Request, res: Response, next: NextFunction) {
    if (dataBase == "MONGO") {
        projects.find({}).then(projects => {
            if (projects.length == 0) {
                res.status(201).json(
                    {
                        "statusCode": 201,
                        "message": messages.NoProjects
                    }
                )
                return res;
            }
            else {
                res.status(200).json(
                    {
                        "statusCode": 200,
                        "message": messages.listOfProjects,
                        projects
                    }
                )
                return res;

            }

        }).catch(err => {
            res.status(500).json(
                {
                    "statusCode": 500,
                    "message": messages.errorData
                }
            )
            return res;
        })
    }
    { // projects.find({}).then(projects => {
        projectRepo.findall().then(projects => {
            if (projects.length == 0) {
                res.status(201).json(
                    {
                        "statusCode": 201,
                        "message": messages.NoProjects
                    }
                )
                return res;
            }
            else {
                res.status(200).json(
                    {
                        "statusCode": 200,
                        "message": messages.listOfProjects,
                        projects
                    }
                )
                return res;

            }

        }).catch(err => {
            res.status(500).json(
                {
                    "statusCode": 500,
                    "message": messages.errorData
                }
            )
            return res;
        })
    }
}
export async function postUsreDetails(req: IncomingMessage, res: Response, next: NextFunction) {
    let now = new Date();
    let currentDateAndTime = date.format(now, 'YYYY-MM-DD HH:mm:ss');
    let form = new formidable.IncomingForm();
    form.parse(req, async function (error, fields, files: any) {
        let firstName: any = fields.firstName;
        let lastName: any = fields.lastName;
        let checkFname = await validation.isAlphaorNot(firstName);
        let checkLname = await validation.isAlphaorNot(lastName);
        let fnLength = await validation.lengthVerification(firstName, 2, 50);
        let lnLength = await validation.lengthVerification(lastName, 2, 50);
        if (checkFname == false || checkLname == false) {
            responseData =
            {
                "statusCode": 202,
                "message": "First Name and last Name accepts only alphabets "
            }
            jsonContent = JSON.stringify(responseData);
            res.status(202).end(jsonContent);
            return res;
        }
        if (fnLength == false || lnLength == false) {
            responseData =
            {
                "statusCode": 202,
                "message": "Enter first name and last name range in between 3 to 50 chnaracter only "
            }
            jsonContent = JSON.stringify(responseData);
            res.status(202).end(jsonContent);
            return res;
        }

        if (files.filetoupload?.mimetype == 'image/png' || files.filetoupload.mimetype == 'image/jpg' || files.filetoupload.mimetype == 'image/jpeg') {

            console.log("enter123");
            var dir = './public/resources/images';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            let data: any = await readFile(files.filetoupload.filepath);
            writeFile(dir + "/" + middlewhere.userid + ".png", data);
            let profilePic = "/images/" + middlewhere.userid + ".png";
            let userDetailss = new userDetails({
                user_id: middlewhere.userid,
                first_name: firstName,
                last_name: lastName,
                profile_pic: profilePic,
                created_on: currentDateAndTime,
                updated_on: currentDateAndTime
            });
            if (dataBase == "MONGO") {
                userDetailss.save().then(result => {
                    res.status(200).json({
                        "statusCode": 200,
                        "message": "User details inserted successfully"
                    })
                }).then(err =>
                    res.status(500).json({
                        "statusCode": 500,
                        "message": "error while insert the user details"
                    })
                )

            }
            else { // userDetailss.save().then(result => {
                UserDetaRepo.save(userDetailss).then(result => {
                    res.status(200).json({
                        "statusCode": 200,
                        "message": "User details inserted successfully"
                    })
                }).then(err =>
                    res.status(500).json({
                        "statusCode": 500,
                        "message": "error while insert the user details"
                    })
                )
            }
        }
        else {
            console.log("enter123456");
            let responseData =
            {
                "statusCode": 201,
                "message": "Upload only jpg,jpeg,png format pictures only"
            };
            const jsonContent = JSON.stringify(responseData);
            res.status(201).json(jsonContent);
            return res;
        }

    })
}
export async function putUsreDetails(req: IncomingMessage, res: Response, next: NextFunction) {
    let now = new Date();
    let currentDateAndTime = date.format(now, 'YYYY-MM-DD HH:mm:ss');
    let form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files: any) {
        let firstName: any = fields.firstName
        let lastName: any = fields.lastName;
        let checkFname = await validation.isAlphaorNot(firstName);
        let checkLname = await validation.isAlphaorNot(lastName);
        let fnLength = await validation.lengthVerification(firstName, 2, 50);
        let lnLength = await validation.lengthVerification(lastName, 2, 50);
        if (checkFname == false || checkLname == false) {
            responseData =
            {
                "statusCode": 202,
                "message": "First Name and last Name accepts only alphabets "
            }
            jsonContent = JSON.stringify(responseData);
            res.status(202).end(jsonContent);
            return res;
        }
        if (fnLength == false || lnLength == false) {
            responseData =
            {
                "statusCode": 202,
                "message": "Enter first name and last name range in between 3 to 50 chnaracter only "
            }
            jsonContent = JSON.stringify(responseData);
            res.status(202).end(jsonContent);
            return res;
        }
        // console.log(files);
        // console.log(files.filetoupload);
        if (files.filetoupload?.mimetype != 'image/png' || files.filetoupload.mimetype != 'image/jpg' || files.filetoupload.mimetype != 'image/jpeg') {
            let responseData =
            {
                "statusCode": 201,
                "message": "Upload only jpg,jpeg,png format pictures only"
            };
            const jsonContent = JSON.stringify(responseData);
            res.status(201).json(jsonContent);
            return res;
        }
        var dir = './public/resources/images';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        let data: any = readFile(files.filetoupload.filepath);
        writeFile(dir + "/" + middlewhere.userid + ".png", data);
        let profilePic = "/images/" + middlewhere.userid + ".png";
        let userDetailss = {
            first_name: firstName,
            last_name: lastName,
            profile_pic: profilePic,
            updated_on: currentDateAndTime
        };
        let updatebasedonId = { $set: { user_id: middlewhere.userid } };
        if (dataBase == "MONGO") {
            await userDetails.findOneAndUpdate(updatebasedonId, userDetailss).then(result => {
                res.status(200).json({
                    "statusCode": 200,
                    "message": "User details updated successfully"
                })
            }).then(err =>
                res.status(500).json({
                    "statusCode": 500,
                    "message": "error while insert the user details"
                })
            )
        }
        else {// await userDetails.findOneAndUpdate(updatebasedonId, userDetailss).then(result => {
            UserDetaRepo.findOneAndUpdate(updatebasedonId, userDetailss).then(result => {
                res.status(200).json({
                    "statusCode": 200,
                    "message": "User details updated successfully"
                })
            }).then(err =>
                res.status(500).json({
                    "statusCode": 500,
                    "message": "error while insert the user details"
                })
            )
        }
    })

}
export async function deleteUsreDetails(req: Request, res: Response, next: NextFunction) {
    const id = req.query.id;
    if (!id) {
        res.status(201).json({
            "statusCode": 201,
            "message": messages.validinput
        })
    }
    else {
        let deleteUsingId = { id: id };
        if (dataBase == "MONGO") {
            userDetails.deleteOne(deleteUsingId).then(result => {
                res.status(200).json({
                    "statusCode": 200,
                    "message": "project details deleyte successfully"
                })
            }).catch(err => {
                res.status(500).json({
                    "statusCode": 500,
                    "message": "Error while delete the project details"
                })
            })
        }
        else {// userDetails.deleteOne(deleteUsingId).then(result => {
            UserDetaRepo.deletee(deleteUsingId).then(result => {
                res.status(200).json({
                    "statusCode": 200,
                    "message": "project details deleyte successfully"
                })
            }).catch(err => {
                res.status(500).json({
                    "statusCode": 500,
                    "message": "Error while delete the project details"
                })
            })
        }
    }
}
export async function getUsreDetails(req: Request, res: Response, next: NextFunction) {
    if (dataBase == "MONGO") {
        // userDetails.find({ user_id: middlewhere.userid }).then(userdetails => {
        UserDetaRepo.findall({ user_id: middlewhere.userid }).then(userdetails => {
            if (userdetails.length == 0) {
                res.status(201).json(
                    {
                        "statusCode": 201,
                        "message": "Please add user details "
                    }
                )
                return res;
            }
            else {
                res.status(200).json(
                    {
                        "statusCode": 200,
                        "message": "Listing of user details successfully",
                        "userdetails": userdetails
                    }
                )
                return res;

            }
        }).catch(err => {
            res.status(500).json({
                "statusCode": 500,
                "message": "Error while getting the userdetails"
            })
        })
    }
    else {
        let id=middlewhere.userid;
        console.log("*********************************************");
        console.log(id);
        let data = await UserDetaRepo.findall({"id":id});
        if (data.length == 0) {
            res.status(201).json(
                {
                    "statusCode": 201,
                    "message": "No data found"
                }
            )
            return res;
        }
        else {
            res.status(200).json(
                {
                    "statusCode": 200,
                    "message": messages.getUserdetails,
                    "data": data
                }
            )
            return res;
        }

    }
}
export async function deleteUserDetails(req: Request, res: Response, next: NextFunction) {
    let id = req.query.id;
    if (!id) {
        res.status(201).json({
            "statusCode": 201,
            "message": messages.validinput
        })
        return res;
    }
    else {
        if (dataBase == "MONGO") {
            let deleteUsersId = { _id: id };
            let deleteuserDetails = { user_id: id };
            let deleteProjects = { created_by: id };
            user.deleteOne(deleteUsersId).then(result => {

                userDetails.deleteOne(deleteuserDetails).then(result => {

                    projects.deleteMany(deleteProjects).then(result => {

                        res.status(201).json({
                            "statusCode": 201,
                            "message": messages.deleteallUserdetailsSuccess
                        })
                        return res;
                    })
                })

            }).catch(error => {
                res.status(201).json({
                    "statusCode": 201,
                    "message": messages.QueryError
                })
                return res;
            })
        }

        else {
            let deleteUsersId = { id: id };
            let deleteuserDetails = { user_id: id };
            let deleteProjects = { created_by: id };
            // user.deleteOne(deleteUsersId).then(result => {
            userRepo.remove(deleteUsersId).then(result => {
                // userDetails.deleteOne(deleteuserDetails).then(result => {
                UserDetaRepo.deletee(deleteuserDetails).then(result => {
                    // projects.deleteMany(deleteProjects).then(result => {
                    projectRepo.deleteOne(deleteProjects).then(result => {
                        res.status(201).json({
                            "statusCode": 201,
                            "message": messages.deleteallUserdetailsSuccess
                        })
                        return res;
                    })
                })

            }).catch(error => {
                res.status(201).json({
                    "statusCode": 201,
                    "message": messages.QueryError
                })
                return res;
            })
        }

    }
}
export async function usercount(req: Request, res: Response, next: NextFunction) {

    if (dataBase == "MONGO") {
        let adminCount: number = await user.find({ roleId: 1 }).count();
        let userCount: number = await user.find({ roleId: 2 }).count();
        let total: number = adminCount + userCount;
        let data: any = { "users": userCount, "admins": adminCount, "total": total };
        let responseData =
        {
            "statusCode": 200,
            "message": messages.GetCountSuccess,
            "data": data
        };
        jsonContent = JSON.stringify(responseData);
        res.status(200).end(jsonContent);
        return res;
    }
    else {// let adminCount: number = await user.find({ roleId: 1 }).count();
        // let userCount: number = await user.find({ roleId: 2 }).count();
        let adminCount = await userRepo.findCount({ roleId: 1 });
        let userCount: number = await userRepo.findCount({ roleId: 2 });
        let total: number = adminCount + userCount;
        let data: any = { "users": userCount, "admins": adminCount, "total": total };
        let responseData =
        {
            "statusCode": 200,
            "message": messages.GetCountSuccess,
            "data": data
        };
        jsonContent = JSON.stringify(responseData);
        res.status(200).end(jsonContent);
        return res;
    }
}
export async function sendUserinfo(req: Request, res: Response, next: NextFunction) {
    cron.schedule('* * * * 1 *', async function () {
        console.log("entered1");
        // let emailId = req.data.emailId;
        let result: any;
        const emailIdformail: string = "harshavardhan.kadupu@ideabytes.com";
        let emailId = "harshavardhan.kadupu@ideabytes.com";
        let userid = 10;
        let now = new Date();
        let today = now.getDate();
        let previosmonth: any = now.getMonth();
        if (previosmonth < 10) {
            previosmonth = '0' + previosmonth;
        }
        let year = now.getFullYear();
        let time = date.format(now, 'HH:mm:ss')
        let previousMonth = year + "-" + previosmonth + "-" + today + " " + time;
        let currentDateAndTime = date.format(now, 'YYYY-MM-DD HH:mm:ss');

        if (dataBase == "MONGO") {
            result = await user.find({ create_date_and_time: { $gte: currentDateAndTime, $lte: previousMonth } })
            if (result.length == 0) {

                let message = "<p>" + "No users found in " + currentDateAndTime + " to " + previousMonth + "</p>";
                mail(emailIdformail, emailId, "User data", "", message, "");
            }
            else {
                generateExcel(result);
                console.log("else block enterted");
                let htmlfront = "<style>table, th, td {  border:1px solid black; }  </style>" +
                    "<table>" +
                    "<tr>" +
                    "<th> role_id </th>" +
                    "<th> id </th>" +
                    "<th>user name </th>" +
                    "<th>email_id</th>" +
                    "<th>created_date_and_time </th>" +
                    "</tr>" +
                    "<tr>";
                var row = "";
                for (let i = 0; i < result.length; i++) {
                    row += "<td>" + result[i].roleId + "</td>" +
                        "<td>" + result[i]._id + "</td>" +
                        "<td>" + result[i].userName + "</td>" +
                        "<td>" + result[i].emailid + "</td>" +
                        "<td>" + result[i].create_date_and_time + "</td>";
                }
                let tablelast = "</tr> </table>";
                let html_content = htmlfront + row + tablelast;

                let attachments = [{
                    filename: 'userdata.xlsx',
                    path: './userdata.xlsx'
                }];
                let sentemail = await mail(emailIdformail, emailId, "User data", html_content, "", attachments);
                if (sentemail == true) {
                    let responseData =
                    {
                        "statusCode": 200,
                        "message": messages.emailSend
                    };
                    const jsonContent = JSON.stringify(responseData);
                    res.status(200).end(jsonContent);
                    return res;
                }
                else {
                    let responseData =
                    {
                        "statusCode": 200,
                        "message": messages.emailerr
                    };
                    const jsonContent = JSON.stringify(responseData);
                    res.status(200).end(jsonContent);
                    return res;
                }
            }
        }
        else {
            result = await userRepo.findd({ currentDateAndTime: currentDateAndTime, previousMonth: previousMonth });
            if (result.length == 0) {

                let message = "<p>" + "No users found in " + currentDateAndTime + " to " + previousMonth + "</p>";
                mail(emailIdformail, emailId, "User data", "", message, "");
            }
            else {
                generateExcel(result);
                console.log("else block enterted");
                let htmlfront = "<style>table, th, td {  border:1px solid black; }  </style>" +
                    "<table>" +
                    "<tr>" +
                    "<th> role_id </th>" +
                    "<th> id </th>" +
                    "<th>user name </th>" +
                    "<th>email_id</th>" +
                    "<th>created_date_and_time </th>" +
                    "</tr>" +
                    "<tr>";
                var row = "";
                for (let i = 0; i < result.length; i++) {
                    row += "<td>" + result[i].role_id + "</td>" +
                        "<td>" + result[i].id + "</td>" +
                        "<td>" + result[i].user_name + "</td>" +
                        "<td>" + result[i].email_id + "</td>" +
                        "<td>" + result[i].created_date_and_time + "</td>";
                }
                let tablelast = "</tr> </table>";
                let html_content = htmlfront + row + tablelast;

                let attachments = [{
                    filename: 'userdata.xlsx',
                    path: './userdata.xlsx'
                }];
                let sentemail = await mail(emailIdformail, emailId, "User data", html_content, "", attachments);
                if (sentemail == true) {
                    let responseData =
                    {
                        "statusCode": 200,
                        "message": messages.emailSend
                    };
                    const jsonContent = JSON.stringify(responseData);
                    res.status(200).end(jsonContent);
                    return res;
                }
                else {
                    let responseData =
                    {
                        "statusCode": 200,
                        "message": messages.emailerr
                    };
                    const jsonContent = JSON.stringify(responseData);
                    res.status(200).end(jsonContent);
                    return res;
                }
            }
        }

    })

}
export async function appInfo(req: Request, res: Response, next: NextFunction) {
    let data: any = { "name": constants.name, "version": constants.version, "NodeVersion": process.versions.node, "NpmVersion": constants.npm_version };
    let responseData =
    {
        "statusCode": 200,
        "message": "The project details",
        "AppData": data
    };
    const jsonContent = JSON.stringify(responseData);
    res.status(200).end(jsonContent);
    return res;
}
export async function allusers(req: Request, res: Response, next: NextFunction) {
    if (dataBase == "MONGO") {
        UserDetaRepo.findall({ user_id: middlewhere.userid }).then(userdetails => {
            if (userdetails.length == 0) {
                res.status(201).json(
                    {
                        "statusCode": 201,
                        "message": "Please add user details "
                    }
                )
                return res;
            }
            else {
                res.status(200).json(
                    {
                        "statusCode": 200,
                        "message": "Listing of user details successfully",
                        "userdetails": userdetails
                    }
                )
                return res;

            }
        }).catch(err => {
            res.status(500).json({
                "statusCode": 500,
                "message": "Error while getting the userdetails"
            })
        })
    }
    else {
        let id=middlewhere.userid;
        console.log("*********************************************");
        console.log(id);
        let data = await UserDetaRepo.findall({"id":id});
        if (data.length == 0) {
            res.status(201).json(
                {
                    "statusCode": 201,
                    "message": "No data found"
                }
            )
            return res;
        }
        else {
            res.status(200).json(
                {
                    "statusCode": 200,
                    "message": messages.getUserdetails,
                    "data": data
                }
            )
            return res;
        }

    }
}