const express=require("express");
const cors=require("cors");
const {connection}=require("./db")
const{userRouter}=require("./routes/Users.routes")
const {doctorRouter}=require("./routes/Doctors.routes");
const{auth}=require("./middelware/auth")
const app=express();
app.use(express.json());
app.use(cors());


app.get("/",(req,res)=>{
    res.send({message:"Masai Hospital Api Working!",
signup:"url/user/signup",
login:"url/user/login",
add:"url/appointment/create",
update:"url/appointment/update/id",
delete:"url/appointment/delete/id",
search:"url/appointment?q={query}"})
});

app.use("/user",userRouter);
app.use(auth);
app.use("/appointment",doctorRouter)
var port=process.env.port || 8080
app.listen(port,async()=>{
    try {
        await connection;
        console.log("Connected To the MongoDB");
    } catch (error) {
        console.log("Error while connecting to MongoDB");
        console.log(error);
    }
    console.log(`Server running on port ${port}` )
})