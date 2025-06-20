const express = require('express')
const {GetDepartment,DepartmentController}=require('../controller/DepartmentController')

const router=express.Router()

router.get('/getAllDepartment',GetDepartment)
router.post('/CreateDepartment',DepartmentController)

module.exports=router