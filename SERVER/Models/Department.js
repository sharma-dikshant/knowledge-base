const mongoose = require('mongoose')

const DepartmentSchema= new mongoose.Schema({
    Department:{type:String,require:true,unique:true},
    Departmentid:{type:Number,require:true,unique:true}
    
},{timestamps:true})

const Department= mongoose.model("Department",DepartmentSchema);

module.exports=Department