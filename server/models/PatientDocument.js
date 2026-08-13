import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  patient:{type:mongoose.Schema.Types.ObjectId,ref:'Patient',required:true,index:true},
  category:{type:String,default:'Other Documents'}, originalName:{type:String,required:true}, mimeType:String, fileSize:{type:Number,default:0},
  fileUrl:String, publicId:String, resourceType:{type:String,default:'raw'}, deliveryType:{type:String,default:'upload'}, format:String,
  uploadedBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'}
},{timestamps:true});
export default mongoose.models.PatientDocument || mongoose.model('PatientDocument',schema);
