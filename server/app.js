import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import {cloudinaryConfigured} from './config/cloudinary.js';
import auth from './routes/auth.js';
import users from './routes/users.js';
import patients from './routes/patients.js';
import inventory from './routes/inventory.js';
import appointments from './routes/appointments.js';
import masterData from './routes/masterData.js';
import settings from './routes/settings.js';
import activity from './routes/activity.js';
import dashboard from './routes/dashboard.js';
import billing from './routes/billing.js';
import cases from './routes/cases.js';
import investigations from './routes/investigations.js';
import search from './routes/search.js';
import analytics from './routes/analytics.js';

await connectDB();
const app=express();
const origins=String(process.env.CLIENT_URL||'http://localhost:5173').split(',').map(s=>s.trim()).filter(Boolean);
for (const host of [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL]) {
  if (host) origins.push(`https://${String(host).replace(/^https?:\/\//,'').replace(/\/$/,'')}`);
}
const allowLan=String(process.env.ALLOW_LAN||'false').toLowerCase()==='true';
function isPrivateLanOrigin(origin=''){
 try{const u=new URL(origin);const h=u.hostname;return h==='localhost'||h==='127.0.0.1'||/^10\./.test(h)||/^192\.168\./.test(h)||/^172\.(1[6-9]|2\d|3[01])\./.test(h)}catch{return false}
}
app.use(cors({origin:(origin,cb)=>!origin||origins.includes('*')||origins.includes(origin)||(allowLan&&isPrivateLanOrigin(origin))?cb(null,true):cb(new Error('CORS blocked')),credentials:true}));
app.use(express.json({limit:'2mb'}));
app.use(express.urlencoded({extended:true}));
app.get('/api/health',(req,res)=>res.json({ok:true,database:true,cloudinary:cloudinaryConfigured(),lan:allowLan,time:new Date().toISOString()}));
app.use('/api/auth',auth);app.use('/api/users',users);app.use('/api/patients',patients);app.use('/api/inventory',inventory);app.use('/api/appointments',appointments);app.use('/api/master-data',masterData);app.use('/api/settings',settings);app.use('/api/activity',activity);app.use('/api/dashboard',dashboard);app.use('/api/billing',billing);app.use('/api/cases',cases);app.use('/api/investigations',investigations);app.use('/api/search',search);app.use('/api/analytics',analytics);
app.use((err,req,res,next)=>{console.error(err);res.status(err.status||400).json({message:err.message||'Request failed'})});
export default app;
