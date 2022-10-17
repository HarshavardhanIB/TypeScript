"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const mysql_1 = __importDefault(require("mysql"));
const util_1 = __importDefault(require("util"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function connection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("entered into connection fike");
            let config = {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
                insecureAuth: process.env.DB_INSECUREAUTH,
                debug: true
            };
            const connection = mysql_1.default.createConnection(config);
            const db = util_1.default.promisify(connection.query).bind(connection);
            return { db, connection };
        }
        catch (error) {
            console.log("error while connect the db");
        }
    });
}
exports.connection = connection;
;
