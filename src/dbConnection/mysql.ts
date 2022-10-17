import mysql from 'mysql';
import util from 'util';
import e, { NextFunction } from 'express';
import dotenv from "dotenv";
import * as messages from '../services/messges.services';
import apierr from '../middleware/apierr.middleware';
dotenv.config();
export async function connection() {
  try {
    console.log("entered into connection fike");
    let config: any =
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      insecureAuth: process.env.DB_INSECUREAUTH,
      debug: true
    }
    const connection: any = mysql.createConnection(config);
    const db = util.promisify(connection.query).bind(connection);
    return {db,connection};

  }

  catch (error) {
    console.log("error while connect the db");
  }
};
















