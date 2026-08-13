import 'dotenv/config';
import bcrypt from 'bcryptjs';
import {connectDB} from './config/db.js';
import User from './models/User.js';
import Medicine from './models/Medicine.js';
import MasterData from './models/MasterData.js';
import Setting from './models/Setting.js';

try{
 const db=await connectDB();
 console.log(`MongoDB connected: ${db.connection.host}/${db.connection.name}`);
 if(await User.countDocuments()===0){
  const password=await bcrypt.hash('admin123',12);
  await User.insertMany([
   {name:'System Admin',email:'admin@clinic.com',password,role:'Admin',isActive:true},
   {name:'Dr. Sharma',email:'doctor@clinic.com',password,role:'Doctor',isActive:true},
   {name:'Desk Staff',email:'staff@clinic.com',password,role:'Junior Staff',isActive:true}
  ]);
  console.log('Default users created.');
 }
 if(await Medicine.countDocuments()===0){
  await Medicine.insertMany([
   {name:'Ashwagandha Churna',type:'Powder',unit:'gm',stock:1000,price:1.50,lowStockThreshold:20},
   {name:'Triphala Guggulu',type:'Tablet',unit:'tabs',stock:500,price:2.00,lowStockThreshold:20},
   {name:'Dashmoolarishta',type:'Liquid',unit:'ml',stock:1000,price:.50,lowStockThreshold:20},
   {name:'Brahmi Vati',type:'Tablet',unit:'tabs',stock:200,price:3.00,lowStockThreshold:20},
   {name:'Abhrak Bhasma',type:'Bhasma',unit:'gm',stock:100,price:15.00,lowStockThreshold:20},
   {name:'Swarna Bhasma',type:'Bhasma',unit:'mg',stock:15,price:250.00,lowStockThreshold:20}
  ]);
  console.log('Default medicines created.');
 }
 const settings={clinic_name:'Ayurvedshala',consultation_fee:500,clinic_logo:'',clinic_address:'',clinic_phone:'',clinic_email:'',clinic_gst:'',print_header:'',print_footer:'',theme:'light',currency_symbol:'₹',upi_id:'',gst_rate:0};
 for(const [key,value] of Object.entries(settings))await Setting.findOneAndUpdate({key},{value},{upsert:true,new:true});
 const master={
  prakriti:['Vata','Pitta','Kapha'],
  vikriti:['Vata Dosha','Pitta Dosha','Kapha Dosha'],
  nadi:['Manduka (Frog/Pitta)','Hamsa (Swan/Kapha)','Sarpa (Snake/Vata)'],
  agni:['Sama Agni','Visham Agni','Tikshna Agni','Manda Agni'],
  mala:['Sama (Normal)','Baddha (Constipated)','Drava (Loose)'],
  mutra:['Prakrit (Normal)','Peeta (Yellow)','Daha (Burning)'],
  jivha:['Niram (Clean)','Saam (Coated)'],
  shabda:['Prakrit (Normal)','Vikrit (Abnormal)'],
  sparsha:['Ushna (Hot)','Sheeta (Cold)','Snigdha (Unctuous)','Ruksha (Dry)'],
  druk:['Prakrit (Normal)','Ruksha (Dry)','Peeta (Yellowish)'],
  akruti:['Sthula (Obese)','Krisha (Emaciated)','Madhyama (Moderate)'],
  sara:['Rakta Sara','Mamsa Sara','Asthi Sara'],
  samhanana:['Pravara (Excellent)','Madhyama (Moderate)','Avara (Poor)'],
  pramana:['Sama (Proportionate)','Vishama (Disproportionate)'],
  satmya:['Sarva Rasa Satmya','Eka Rasa Satmya'],
  sattva:['Pravara (Strong)','Madhyama (Medium)','Avara (Weak)'],
  vyayama_shakti:['Pravara (High)','Madhyama (Moderate)','Avara (Low)'],
  dosage:['1-0-1 (After Meals)','1-1-1 (Before Meals)','0-0-1 (Bedtime)'],
  duration:['3 Days','7 Days','15 Days','1 Month'],
  diag_dosha:['Vata','Pitta','Kapha','Tridosha'],
  diag_dushya:['Rasa','Rakta','Mamsa','Asthi'],
  diag_srotas:['Pranavaha','Annavaha','Rasavaha'],
  diag_agni:['Jatharagni Mandya','Dhatvagni Mandya'],
  diag_ama:['Sama','Nirama']
 };
 for(const [category,values] of Object.entries(master))for(const value of values)await MasterData.findOneAndUpdate({category,value},{category,value},{upsert:true,new:true});
 console.log('Settings and PHP-equivalent master data seeded.');
 console.log('Seed complete. Admin: admin@clinic.com / admin123');
 process.exit(0);
}catch(error){console.error('Seed failed:',error);process.exit(1)}
