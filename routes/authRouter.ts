import express from 'express';
const router=express.Router();
import {registration,login,activate} from '../controller/auth';
router.post("/registration",registration)
router.post("/login",login);
router.get("/activation",activate);
export default router;