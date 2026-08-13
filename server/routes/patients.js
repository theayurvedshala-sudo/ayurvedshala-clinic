import { Router } from 'express';
import Patient from '../models/Patient.js';
import CasePaper from '../models/CasePaper.js';
import Prescription from '../models/Prescription.js';
import Billing from '../models/Billing.js';
import Investigation from '../models/Investigation.js';
import Appointment from '../models/Appointment.js';
import PatientDocument from '../models/PatientDocument.js';
import { protect, allow } from '../middleware/auth.js';
import { logActivity } from '../utils/logActivity.js';
import { upload, imageUpload } from '../middleware/upload.js';
import { uploadBuffer, deleteCloudinaryAsset } from '../utils/cloudinaryUpload.js';

const r=Router(); r.use(protect);
const folder=()=>process.env.CLOUDINARY_FOLDER||'ayurvedshala-clinic';
const mediaType=()=>process.env.CLOUDINARY_PATIENT_MEDIA_TYPE||'upload';
const esc=s=>String(s||'').replace(/[.*+?^${}()|[\]\\]/g,'\\$&');

r.get('/',async(req,res)=>{const q=String(req.query.q||'').trim();const f=q?{$or:[{name:{$regex:esc(q),$options:'i'}},{phone:{$regex:esc(q),$options:'i'}},{patientCode:{$regex:esc(q),$options:'i'}}]}:{};res.json(await Patient.find(f).sort({createdAt:-1}).limit(500))});
r.get('/:id',async(req,res)=>{const patient=await Patient.findById(req.params.id);if(!patient)return res.status(404).json({message:'Patient not found'});const [cases,bills,reports,documents,appointments]=await Promise.all([
  CasePaper.find({patient:patient._id}).populate('doctor','name role').sort({createdAt:-1}), Billing.find({patient:patient._id}).sort({createdAt:-1}),
  Investigation.find({patient:patient._id}).populate('uploadedBy','name').sort({createdAt:-1}), PatientDocument.find({patient:patient._id}).populate('uploadedBy','name').sort({createdAt:-1}),
  Appointment.find({patient:patient._id}).populate('doctor','name').sort({appointmentDate:-1})]);
 const caseIds=cases.map(x=>x._id); const prescriptions=await Prescription.find({casePaper:{$in:caseIds}}).populate('items.medicine','name unit');
 res.json({patient,cases,bills,reports,documents,appointments,prescriptions});
});
r.post('/',allow('Admin','Doctor','Senior Staff','Reception'),async(req,res)=>{const patient=await Patient.create({...req.body,patientCode:`PT${Date.now()}`});await logActivity(req,'Patient Registered','patient',patient._id,patient.name);res.status(201).json(patient)});
r.patch('/:id',allow('Admin','Doctor','Senior Staff','Reception'),async(req,res)=>{const patient=await Patient.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});if(!patient)return res.status(404).json({message:'Patient not found'});await logActivity(req,'Patient Updated','patient',patient._id,patient.name);res.json(patient)});

r.post('/:id/photo',allow('Admin','Doctor','Senior Staff','Reception'),imageUpload.single('photo'),async(req,res)=>{if(!req.file)return res.status(400).json({message:'Photo is required'});const patient=await Patient.findById(req.params.id);if(!patient)return res.status(404).json({message:'Patient not found'});const result=await uploadBuffer(req.file.buffer,{folder:`${folder()}/patients/${patient._id}/photo`,public_id:'profile',overwrite:true,type:'upload'});patient.photoUrl=result.secure_url;patient.photoPublicId=result.public_id;patient.photoResourceType=result.resource_type;patient.photoDeliveryType=result.type;await patient.save();await logActivity(req,'Patient Photo Updated','patient',patient._id,patient.name);res.json(patient)});
r.delete('/:id/photo',allow('Admin','Doctor','Senior Staff','Reception'),async(req,res)=>{const p=await Patient.findById(req.params.id);if(!p)return res.status(404).json({message:'Patient not found'});await deleteCloudinaryAsset(p.photoPublicId,p.photoResourceType,p.photoDeliveryType);p.photoUrl='';p.photoPublicId='';p.photoResourceType='';p.photoDeliveryType='';await p.save();res.json(p)});

r.post('/:id/documents',allow('Admin','Doctor','Senior Staff'),upload.array('files',30),async(req,res)=>{const p=await Patient.findById(req.params.id);if(!p)return res.status(404).json({message:'Patient not found'});if(!req.files?.length)return res.status(400).json({message:'Select at least one file'});const category=req.body.category||'Other Documents';const out=[];for(const file of req.files){const result=await uploadBuffer(file.buffer,{folder:`${folder()}/patients/${p._id}/documents`,type:mediaType(),use_filename:true,unique_filename:true});out.push(await PatientDocument.create({patient:p._id,category,originalName:file.originalname,mimeType:file.mimetype,fileSize:file.size,fileUrl:result.secure_url,publicId:result.public_id,resourceType:result.resource_type,deliveryType:result.type,format:result.format,uploadedBy:req.user._id}))}await logActivity(req,'Patient Documents Uploaded','patient',p._id,`${out.length} file(s)`);res.status(201).json(out)});
r.patch('/:id/documents/:docId',allow('Admin','Doctor','Senior Staff'),async(req,res)=>{const doc=await PatientDocument.findOneAndUpdate({_id:req.params.docId,patient:req.params.id},{originalName:req.body.originalName,category:req.body.category},{new:true});if(!doc)return res.status(404).json({message:'Document not found'});res.json(doc)});
r.delete('/:id/documents/:docId',allow('Admin','Doctor','Senior Staff'),async(req,res)=>{const doc=await PatientDocument.findOne({_id:req.params.docId,patient:req.params.id});if(!doc)return res.status(404).json({message:'Document not found'});await deleteCloudinaryAsset(doc.publicId,doc.resourceType,doc.deliveryType);await doc.deleteOne();res.json({message:'Document deleted'})});

r.post('/:id/reports',allow('Admin','Doctor','Senior Staff'),upload.single('file'),async(req,res)=>{if(!req.file)return res.status(400).json({message:'Report file is required'});const p=await Patient.findById(req.params.id);if(!p)return res.status(404).json({message:'Patient not found'});const result=await uploadBuffer(req.file.buffer,{folder:`${folder()}/patients/${p._id}/reports`,type:mediaType(),use_filename:true,unique_filename:true});const report=await Investigation.create({patient:p._id,casePaper:req.body.casePaper||undefined,fileName:req.file.originalname,fileUrl:result.secure_url,publicId:result.public_id,resourceType:result.resource_type,deliveryType:result.type,format:result.format,mimeType:req.file.mimetype,fileSize:req.file.size,category:req.body.category||'Other',status:req.body.status||'Uploaded',notes:req.body.notes||'',uploadedBy:req.user._id});await logActivity(req,'Investigation Report Uploaded','investigation',report._id,p.name);res.status(201).json(report)});
export default r;
