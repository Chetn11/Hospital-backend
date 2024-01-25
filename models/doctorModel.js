const mongoose=require("mongoose");

const DoctorsSchema = mongoose.Schema({
    name:{type:String,required:true},
    image:{type:String,required:true},
    specialization:{type:String,enum:['Cardiologist','Dermatologist','Pediatrician','Psychiatrist']},
    experience:{type:Number,required:true},
    location:{type:String,required:true},
    date:{type:String,required:true},
    slots:{type:Number,required:true},
    fee:{type:Number,required:true},
    
})


const DoctorModel=mongoose.model("doctor",DoctorsSchema);

module.exports={DoctorModel};