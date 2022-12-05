import express from 'express';
const router=express.Router();
import{excelInput,jsonInput,dynamicTest,uploadImg} from '../controllers/test.controller'
router.post("/testExcel",excelInput)
router.post("/testJson",jsonInput)
router.post("/testDynamically",dynamicTest)
router.post("/uploadImg",uploadImg)
export default router;