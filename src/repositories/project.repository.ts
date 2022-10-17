
import { nextTick } from 'process';
import { NextFunction } from 'express';
import * as dbcon from '../dbConnection/mysql';
import * as querys from '../services/querys.service'
import apierr from '../middleware/apierr.middleware';
import MailMessage from 'nodemailer/lib/mailer/mail-message';
import mysqljs from 'mysql';
import * as messages from '../services/messges.services'
const table = 'users';
export async function save(project: any) {
    try {
        console.log("enter");
        const connect = await dbcon.connection();
        let db=connect?.db;
        let queryforinsertproject = querys.insertProject;
        let details = db(queryforinsertproject,  [project.project_name, project.project_version, project.created_by, project.created_on, project.updated_on]);
    }
    catch (error) {
        console.error(error);
    }
}
export async function findOneAndUpdate(updateusingId:any, updatingValues:any,next:NextFunction) 
{
    try {
        const connect = await dbcon.connection();
        let queryforupdate=querys.updtaeProject;
        let db=connect?.db;
        let details=db(queryforupdate,[updatingValues.project_name,updatingValues.project_version,updatingValues.updated_on,updateusingId.created_by])
        return details;
    } catch (error) {
        next(apierr.badReq(messages.QueryError));
    }
   
}
export async function deleteOne(id:any) {
    try {
        const connect = await dbcon.connection();
        let queryfordelete=querys.deleteProject;
        let db=connect?.db;
        let details=db(queryfordelete,[id.id]);
        return details;
    } catch (error) {
        console.log(error);
    }
        
}
export async function find(id:any)
{
    try {
        const connect = await dbcon.connection();
        let getProjects=querys.getProjectsForparticularUsrer;
        let db=connect?.db;
        let details=db(getProjects,[id.user_id]);
        return details;
    } catch (error) {
        console.log(error);
    }
}
export async function findall()
{
    try {
        const connect = await dbcon.connection();
        let getProjects=querys.getProjectsForAllDetails;
        let db=connect?.db;
        let details=db(getProjects);
        return details;
    } catch (error) {
        console.log(error);
    }
}