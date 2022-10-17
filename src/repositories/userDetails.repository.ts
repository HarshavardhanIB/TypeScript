
import * as dbcon from '../dbConnection/mysql';
import * as querys from '../services/querys.service'
const table = 'users';
export async function save(userDetails: any) {
    try {
        console.log("enter");
        const connect = await dbcon.connection();
        let db=connect?.db;
        let queryforinsertproject = querys.insertUserDetailsWithProfilePic;
        let details = db(queryforinsertproject, [userDetails.user_id, userDetails.first_name, userDetails.last_name, userDetails.profile_pic, userDetails.created_on, userDetails.updated_on]);
        return details;
    }
    catch (error) {
        console.error(error);
    }
}
export async function findOneAndUpdate(updatebasedonId:any, userDetailss:any) {
    const connect = await dbcon.connection();
    let queryforUpdate = querys.updtaeUserDetailswithProfilePic;
    let db=connect?.db;
    let details=db(queryforUpdate,[userDetailss.first_name,userDetailss.last_name,userDetailss.profile_pic,userDetailss.updated_on,updatebasedonId.user_id]);
    return details;
}
export async function deletee(id:any) {
    const connect = await dbcon.connection();
    let queryfordelete = querys.deleteProject;
    let db=connect?.db;
    let details=db(queryfordelete,[id.id]);
    return details;
}
export async function findall(id:any) {
    const connect = await dbcon.connection();
    let queryfordetails = querys.getUserDetails;
    let db=connect?.db;
    let details=db(queryfordetails,[id.id]);
    return details;
}
