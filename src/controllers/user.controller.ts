import * as messages from '../services/messges';
import * as validation from '../services/validation.services';
import projects from '../model/projects.model';
import userDetails from '../model/projects.model';
import * as middlewhere from '../middleware/verifyToken.middleware';
import * as date from 'date-and-time';
import * as fs from 'fs';
import { readFile, writeFile } from 'fs/promises';
import e, { Response, Request, NextFunction } from "express";
import { IncomingMessage } from 'http';
import * as formidable from 'formidable';
import * as userRepo from '../repositories/user.repository';
import * as projectRepo from '../repositories/project.repository';
import * as UserDetaRepo from '../repositories/userDetails.repository';
import apierr from '../middleware/apierr.middleware';
import * as constants from '../services/constants';
let responseData: any;
const dataBase: any = process.env.DATABASE;
let jsonContent: any;
interface project {
    project_name: string;
    project_version: string;

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
                    "statusCode": 500,
                    "message": messages.insertProjects
                })
                res.end();
                return res;
            }).catch(e => {
                console.log(e.stack);
                next(apierr.badReq("eroor while insert the data "));
            })
        }
        else {// project.save().then(project => {
            projectRepo.save(project).then(project => {
                res.status(200).json({
                    "statusCode": 500,
                    "message": messages.insertProjects
                })
                res.end();
                return res;
            }).catch(e => {
                console.log(e.stack);
                next(apierr.badReq("eroor while insert the data "));
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
                        "message": "error while update "
                    })
                }
            }).catch(err => {
                res.status(500).json({
                    "statusCode": 500,
                    "message": "error on update the value"
                })
            })
        }
        else {// await projects.findOneAndUpdate(updateusingId, updatingValues).then(result => {
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
                        "message": "error while update "
                    })
                }
            }).catch(err => {
                res.status(500).json({
                    "statusCode": 500,
                    "message": "error on update the value"
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
            {
                let deleteUsingId = { id: id };
                await projects.deleteOne(deleteUsingId).then(result => {

                    res.status(200).json({
                        "statusCode": 200,
                        "message": messages.deletedProject
                    })
                }).catch(err => {
                    next(apierr.badReq("Error while delete the projects"));
                })
            }
        }
        else {
            let deleteUsingId = { id: id };
            // await projects.deleteOne(deleteUsingId).then(result => {
            projectRepo.deleteOne({ id: id }).then(result => {
                res.status(200).json({
                    "statusCode": 200,
                    "message": messages.deletedProject
                })
            }).catch(err => {
                next(apierr.badReq("Error while delete the projects"));
            })
        }
    }
}
export async function getProjects(req: Request, res: Response, next: NextFunction) {
    if (dataBase == "MONGO") {
        projects.find({ user_id: middlewhere.userid }).then(projects => {
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
                        "message": "Listing of projects successfully",
                        projects
                    }
                )
                return res;

            }
        }).catch(err => {
            res.status(500).json(
                {
                    "statusCode": 500,
                    "message": "error while get the data "
                });
            return res;
        })
    }
    else {// projects.find({user_id:middlewhere.userid}).then(projects => {
        projectRepo.find({ user_id: middlewhere.userid }).then(projects => {
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
                        "message": "Listing of projects successfully",
                        projects
                    }
                )
                return res;

            }
        }).catch(err => {
            res.status(500).json(
                {
                    "statusCode": 500,
                    "message": "error while get the data "
                });
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
        console.log("*****************")
        console.log(firstName);
        console.log(lastName);
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
            res.end(jsonContent);
            return res;
        }
        if (fnLength == false || lnLength == false) {
            responseData =
            {
                "statusCode": 202,
                "message": "Enter first name and last name range in between 3 to 50 chnaracter only "
            }
            jsonContent = JSON.stringify(responseData);
            res.end(jsonContent);
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
            let profilePic = middlewhere.userid + ".png";
            console.log(profilePic);
            let userDetailss = new userDetails({
                user_id: middlewhere.userid,
                first_name: firstName,
                last_name: lastName,
                profile_pic: profilePic,
                created_on: currentDateAndTime,
                updated_on: currentDateAndTime
            });
            console.log(middlewhere.userid);
            console.log("the userdetails ===",userDetailss)
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
            else {
                // userDetailss.save().then(result => {
                    let ud={"user_id":middlewhere.userid,"first_name":firstName ,"last_name":lastName ,"profile_pic":profilePic,"created_on":currentDateAndTime,"updated_on":currentDateAndTime};
                    let userdetailsCount=await UserDetaRepo.count({ id: middlewhere.userid });
                if(userdetailsCount[0].count==0)
                
                {UserDetaRepo.save(ud).then(result => {
                    res.status(200).json({
                        "statusCode": 200,
                        "message": "User details inserted successfully"
                    })
                }).then(err =>
                    res.status(500).json({
                        "statusCode": 500,
                        "message": "error while insert the user details"
                    })
                )}
                else
                {
                    let updatebasedonId = { user_id: middlewhere.userid };
                    UserDetaRepo.findOneAndUpdate(updatebasedonId, ud).then(result => {
                        // await userDetails.findOneAndUpdate(updatebasedonId, userDetailss).then(result => {
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
            }
        }
        else {
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
export async function putUsreDetails(req: Request, res: Response, next: NextFunction) {
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
            res.end(jsonContent);
            return res;
        }
        if (fnLength == false || lnLength == false) {
            responseData =
            {
                "statusCode": 202,
                "message": "Enter first name and last name range in between 3 to 50 chnaracter only "
            }
            jsonContent = JSON.stringify(responseData);
            res.end(jsonContent);
            return res;
        }

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
        var dir = '../public/resources/images';
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

        else {
            UserDetaRepo.findOneAndUpdate(updatebasedonId, userDetailss).then(result => {
                // await userDetails.findOneAndUpdate(updatebasedonId, userDetailss).then(result => {
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
        if (dataBase == "MONGO") {
            let deleteUsingId = { id: id };
            userDetails.deleteOne(deleteUsingId).then(result => {
                res.status(200).json({
                    "statusCode": 200,
                    "message": "project details deleyte successfully"
                })
            }).catch(err => {
                res.status(500).json({
                    "statusCode": 500,
                    "message": "error while delete the project details"
                })
            })
        }
        else {
            let deleteUsingId = { id: id };
            UserDetaRepo.deletee({ id: id }).then(result => {
                // userDetails.deleteOne(deleteUsingId).then(result => {
                res.status(200).json({
                    "statusCode": 200,
                    "message": "project details deleyte successfully"
                })
            }).catch(err => {
                res.status(500).json({
                    "statusCode": 500,
                    "message": "error while delete the project details"
                })
            })
        }
    }
}
export async function getUsreDetails(req: Request, res: Response, next: NextFunction) {
    if (dataBase == "MONGO") {
        // await userDetails.find({ user_id: middlewhere.userid }).then(userdetails => {
        UserDetaRepo.findall({ user_id: middlewhere.userid }).then(userdetails=> {
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
                "message": "error while insert the user details"
            })
        })
    }
    else {
        // await userDetails.find({ user_id: middlewhere.userid }).then(userdetails => {
        UserDetaRepo.findall({ id: middlewhere.userid }).then(userdetails => {
            console.log("enter");
            console.log("user details >>>>",userdetails);
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
                console.log("user details >>>>",userdetails);
                let data=userdetails[0];
                console.log(userdetails[0]);
                let idindb=data.id;
                let user_id= data.user_id;
                let first_name = data.first_name;
                let last_name=data.last_name;
                let profile_pic=constants.adminportalURL+"images/"+ data.profile_pic;
                let dataArray={"id":idindb,"user_id":user_id,"first_name":first_name,"last_name":last_name,"profile_pic":profile_pic}
                
                res.status(200).json(
                    {
                        "statusCode": 200,
                        "message": "Listing of user details successfully",
                        "userdetails": dataArray
                    }
                )
                return res;

            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                "statusCode": 500,
                "message": "error while get the user details"
            })
        })
    }
}