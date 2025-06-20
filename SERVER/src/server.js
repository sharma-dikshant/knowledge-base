const express = require("express")
const dotenv=require("dotenv")
const ConnectDb = require("../Db/DbConnect")
const userRoutes=require('../Routes/User.Routes')
const adminRoutes=require('../Routes/Admin.Route')
const authRoutes=require('../Routes/AuthRoutes')
const PostRoutes=require('../Routes/PostRoute')
const DepartmentRoutes=require(('../Routes/Department.Route.js'))
const cors = require('cors')

const cookieParser = require("cookie-parser");



const helmet=require('helmet')


dotenv.config();
ConnectDb()
const app=express()
app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" })); // Allow only frontend requests

app.use('/api/user',userRoutes)
app.use('/api/admin',adminRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/post',PostRoutes)
app.use('/api/Departments',DepartmentRoutes)


// app.use("/api/captcha", captchaRoutes);
app.get('/', (req, res) => {
    res.send('Hello, Helmet is protecting this app!');
});
const port=process.env.PORT

app.listen(port,()=>console.log("app is running on: ",port))