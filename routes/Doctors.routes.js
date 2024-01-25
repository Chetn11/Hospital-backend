const express=require("express");
const {DoctorModel}=require("../models/doctorModel");

const doctorRouter=express.Router();


//get all data
doctorRouter.get("/", async (req,res)=>{

    try {
        const q=req.query.q || "";  //search query
        const page=parseInt(req.query.page)-1||0// for page;
        const limit=parseInt(req.query.limit) ||5; // limit
        var sort=req.query.sort; // for sort
        let specialization=req.query.specialization || "ALL";

        const specializationOption=[
            "Cardiologist",
            "Dermatologist",
            "Pediatrician",
            "Psychiatrist"
        ]

        specialization==="ALL"?(specialization=[...specializationOption]):(specialization=req.query.specialization.split(","));

        req.query.sort?(sort=req.query.sort.split(",")):(sort=[sort]);
        let sortBy={};
        if(sort[1]){
            sortBy[sort[0]=sort[1]];
        }
        else{
            sortBy[sort[0]="asc"]
        }

        const doctor=await DoctorModel.find({$or:[{name:{$regex:q,$options:"i"}},{specialization:{$regex:q,$options:"i"}}]})
        .where("specialization").in([...specialization]).sort(sortBy).skip(page*limit).limit(limit);

        const total=await DoctorModel.countDocuments({
            specialization:{$in:[...specialization]},
            name:{$regex:q,$options:"i"}
        })

        const response={
            error:false,
            doctor,
            total,
            page:page+1,
            limit
        }
        res.send(response);
    } catch (error) {
        res.send({error:true,message:"Sorry for issue there is a server Error",
     er:error});
    }
    // const data= await DoctorModel.find()
    // res.json({data:data})
})
// add data
doctorRouter.post("/create",async (req,res)=>{
    const{name,image,specialization,experience,location,date,slots,fee}=req.body;

    const doctor_data=await DoctorModel.create({name,image,specialization,experience,location,date,slots,fee});
    res.send({message:"Data added successfully",
data:doctor_data})
})

// update data
doctorRouter.patch("/update/:docId", async (req,res)=>{
    const doctorId=req.params.docId;
    const payload=req.body;

    const doctor_data=await DoctorModel.findOneAndUpdate({_id:doctorId},payload);
    res.send({message:`Doctor ${doctor_data.name}'s data updated`});
})

//delete data
doctorRouter.delete("/delete/:docId", async (req,res)=>{
    const doctorId=req.params.docId;

    const doctor_data=await DoctorModel.findOneAndDelete({_id:doctorId});
    res.send({message:`Doctor ${doctor_data.name}'s data is deleted`});
})
module.exports={doctorRouter}