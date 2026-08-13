import mongoose from 'mongoose';
const schema=new mongoose.Schema({
 patient:{type:mongoose.Schema.Types.ObjectId,ref:'Patient',required:true,index:true},doctor:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},chiefComplaints:String,diagnosis:String,
 prakriti:String,vikriti:String,nadi:String,agni:String,mala:String,mutra:String,jivha:String,shabda:String,sparsha:String,druk:String,akruti:String,sara:String,samhanana:String,pramana:String,satmya:String,sattva:String,vyayamaShakti:String,
 aharVihar:String,bp:String,pulse:String,weight:Number,temp:String,notes:String,investigationsPrescribed:String,investigationsRecords:String,followUpDate:Date,systemicExamination:String,
 diagDosha:String,diagDushya:String,diagSrotas:String,diagAgni:String,diagAma:String
},{timestamps:true});
export default mongoose.models.CasePaper||mongoose.model('CasePaper',schema);
