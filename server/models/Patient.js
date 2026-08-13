import mongoose from 'mongoose';
const schema=new mongoose.Schema({
  patientCode:{type:String,unique:true,index:true},name:{type:String,required:true,index:true},age:Number,gender:String,phone:{type:String,index:true},email:String,address:String,
  prakriti:String,allergies:{type:String,default:'None'},bloodGroup:String,outstandingAmount:{type:Number,default:0},
  photoUrl:String,photoPublicId:String,photoResourceType:String,photoDeliveryType:String
},{timestamps:true});
export default mongoose.models.Patient||mongoose.model('Patient',schema);
