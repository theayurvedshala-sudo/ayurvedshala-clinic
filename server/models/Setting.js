import mongoose from 'mongoose';
const schema=new mongoose.Schema({key:{type:String,required:true,unique:true},value:{type:mongoose.Schema.Types.Mixed,default:''}},{timestamps:true});
export default mongoose.models.Setting||mongoose.model('Setting',schema);
