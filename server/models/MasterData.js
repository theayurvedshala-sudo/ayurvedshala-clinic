import mongoose from 'mongoose';
const schema=new mongoose.Schema({category:{type:String,required:true,index:true},value:{type:String,required:true}},{timestamps:true});
schema.index({category:1,value:1},{unique:true});
export default mongoose.models.MasterData||mongoose.model('MasterData',schema);
