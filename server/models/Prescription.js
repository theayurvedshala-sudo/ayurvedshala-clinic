import mongoose from 'mongoose';
const item=new mongoose.Schema({medicine:{type:mongoose.Schema.Types.ObjectId,ref:'Medicine'},comboId:String,unitDose:String,dosage:String,duration:String,quantity:Number,price:Number},{_id:false});
const schema=new mongoose.Schema({casePaper:{type:mongoose.Schema.Types.ObjectId,ref:'CasePaper',required:true,unique:true},items:[item],editReason:String},{timestamps:true});
export default mongoose.models.Prescription||mongoose.model('Prescription',schema);
