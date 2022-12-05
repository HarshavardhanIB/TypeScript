
import * as dbcon from '../dbConnection/mysql';
import * as querys from '../services/querys';
import {wrap} from "node-mysql-wrapper";
const mysql = require('mysql'); // or use import if you use TS
import util from 'util';

const table = 'users';
export async function save(user: any) {
    try {
        console.log("enter");
        const connect = await dbcon.connection();
        let db=connect?.db;
        let queryforinsertUser = querys.insertUsers;
        let details = db(queryforinsertUser, [user.roleId, user.userName, user.emailid, user.password, user.active, user.create_date_and_time, user.update_date_and_time, user.key]);
        return details;
    }
    catch (error) {
    }
}
export async function findById(user:any) {
    const connect = await dbcon.connection();
    let db=connect?.db;
        let queryforfind = "select * from users where user_name=?||email_id=?||password=?||active=?||role_id=?";
        const result=await db(queryforfind,[user.id,user.id,user.id,user.id,user.id]); 
        console.log(result);             
        return result;
}
export async function findOne(user:any)
{
    const connect = await dbcon.connection();
    let db=connect?.db;
    let queryforfind = "select * from users where user_name=?||email_id=?"; 
    let details = db(queryforfind,[user.UserName,user.email]);
    return details;
}
export async function findCount(user:any) {
    const connect = await dbcon.connection();
    let db=connect?.db;
    let queryforfind = "select count(*) as count from users where role_id=?"; 
    let details = db(queryforfind,[user.id]);
    console.log(details);
    console.log("count of the query");
    return details;
}
export async function remove(user:any) {
    const connect = await dbcon.connection();
    let db=connect?.db;
    let queryfordelete = querys.deleteUser; 
    let details = db(queryfordelete,[user.id]);
    console.log(details);
    console.log("count of the query");
    return details;
}
export async function findd(user:any)
{
    const connect = await dbcon.connection();
    let db=connect?.db;
    let query = querys.MontlyUserdata;
    let result = db(query, [user.currentDateAndTime, user.previousMonth]);
    return result;
}