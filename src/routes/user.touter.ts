import express from 'express';
const router=express.Router();
import {postproject,deleteProject,putProject,getProjects,deleteUsreDetails,getUsreDetails,postUsreDetails,putUsreDetails} from '../controllers/user.controller';
router.post("/project",postproject);
router.get("/project",getProjects);
router.put("/project",putProject);
router.delete("/project",deleteProject);
router.post("/user_details_service",postUsreDetails);
router.get("/user_details_service",getUsreDetails);
router.put("/user_details_service",putUsreDetails);
router.delete("/user_details_service",deleteUsreDetails);
export default router;