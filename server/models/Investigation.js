import mongoose from 'mongoose';
const schema=new mongoose.Schema({
  patient:{type:mongoose.Schema.Types.ObjectId,ref:'Patient',required:true,index:true}, casePaper:{type:mongoose.Schema.Types.ObjectId,ref:'CasePaper'},
  fileName:String,fileUrl:String,publicId:String,resourceType:{type:String,default:'image'},deliveryType:{type:String,default:'upload'},format:String,mimeType:String,fileSize:Number,
  category:{type:String,default:'Other'},status:{type:String,enum:['Pending','Uploaded','Reviewed','Verified','Doctor Approved'],default:'Uploaded'},notes:String,
  uploadedBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'},reviewedBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'},reviewedAt:Date
},{timestamps:true});
export default mongoose.models.Investigation||mongoose.model('Investigation',schema);
