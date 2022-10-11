import {Request,Response,NextFunction} from 'express';
import apierr  from './apierr';
function apiErrHandler(error:any,req:Request,res:Response,next:NextFunction){
    console.log("=====================middle where==============================");

if(error instanceof apierr)
{
    res.status(error.code).json({
        "statusCode":error.code,
        "message":error.message
    });
    return;
}
    res.status(500).send('Something went wrong');
    return;
}
export default apiErrHandler;