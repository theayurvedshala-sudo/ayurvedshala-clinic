import mongoose from 'mongoose';
const schema=new mongoose.Schema({
  name:{type:String,required:true,index:true},type:String,unit:{type:String,default:'units'},stock:{type:Number,default:0},price:{type:Number,default:0},purchasePrice:{type:Number,default:0},
  lowStockThreshold:{type:Number,default:20},batchNumber:String,expiryDate:Date,barcode:{type:String,index:true},manufacturer:String,supplier:String,
  imageUrl:String,imagePublicId:String,imageResourceType:String,imageDeliveryType:String
},{timestamps:true});
schema.index({name:1},{unique:true,collation:{locale:'en',strength:2}});
export default mongoose.models.Medicine||mongoose.model('Medicine',schema);
