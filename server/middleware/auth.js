import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export async function protect(req,res,next){try{const h=req.headers.authorization||'';const token=h.startsWith('Bearer ')?h.slice(7):null;if(!token)return res.status(401).json({message:'Authentication required'});const d=jwt.verify(token,process.env.JWT_SECRET);const user=await User.findById(d.id).select('-password');if(!user||!user.isActive)return res.status(401).json({message:'Account unavailable'});req.user=user;next();}catch(e){res.status(401).json({message:'Invalid or expired session'});}}
export const allow=(...roles)=>(req,res,next)=>roles.includes(req.user.role)?next():res.status(403).json({message:'You do not have permission for this action'});
