import mongoose from 'mongoose';
const schema=new mongoose.Schema({patient:{type:mongoose.Schema.Types.ObjectId,ref:'Patient',required:true},doctor:{type:mongoose.Schema.Types.ObjectId,ref:'User'},appointmentDate:{type:Date,required:true,index:true},appointmentTime:String,reason:String,notes:String,status:{type:String,enum:['Upcoming','Completed','Cancelled','No Show'],default:'Upcoming'},createdBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'}},{timestamps:true});
export default mongoose.models.Appointment||mongoose.model('Appointment',schema);
