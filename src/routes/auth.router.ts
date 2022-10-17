import express from 'express';
const router=express.Router();
import {registration,login,activate} from '../controllers/auth.controller';
router.post("/registration",registration)
router.post("/login",login);
router.get("/activation",activate);
export default router;