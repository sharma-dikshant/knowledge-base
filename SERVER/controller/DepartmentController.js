const Department = require('../Models/Department');

const DepartmentController=async(req,res)=>{
try {
    const {department,departmentid}= req.body
    if(!department||!departmentid){
        return res.status(400).json({message:"all parameter required"})
    }
    console.log(departmentid)
const DepartmentExist= await Department.find({Departmentid:departmentid})
console.log(DepartmentExist.length>0)
if(DepartmentExist.length>0){
    return res.status(400).json({message:"department already exist"})
}
    const DepartmentData= new Department({
        Department:department,
        Departmentid:departmentid
    })

    await DepartmentData.save()
    return res.status(201).json({message:"Department created successfully"})
} catch (error) {
    console.log(error)
    return res.status(500).json({message:"internal server error",error})
}
}

const GetDepartment=async(req,res)=>{
    try {
       const department= await Department.find();
       if(!department){
        return res.status(500).json({message:"intern server error",error})
       }
      return res.status(201).json({message:"department fetched successfully",data:department})
    } catch (error) {
        return res.status(500).json({message:"internal server error"})
    }
}

module.exports={GetDepartment,DepartmentController}