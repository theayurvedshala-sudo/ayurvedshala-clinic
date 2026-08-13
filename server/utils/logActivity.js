import ActivityLog from '../models/ActivityLog.js';
export async function logActivity(req,action,entityType='',entityId='',details=''){try{await ActivityLog.create({user:req.user?._id,action,entityType,entityId:String(entityId||''),details,ipAddress:req.ip,userAgent:req.headers['user-agent']||''});}catch{}}
