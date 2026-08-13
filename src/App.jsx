import {Navigate,Route,Routes} from 'react-router-dom';
import {useAuth} from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientProfile from './pages/PatientProfile';
import Consultation from './pages/Consultation';
import Appointments from './pages/Appointments';
import Investigations from './pages/Investigations';
import Inventory from './pages/Inventory';
import Billing from './pages/Billing';
import Analytics from './pages/Analytics';
import {Staff,MasterData,Activity,SettingsPage} from './pages/AdminPages';
import {NabhPrint,InvoicePrint} from './pages/PrintPages';

function Guard(){const {user,loading}=useAuth();if(loading)return <div className="screen-center">Loading clinic...</div>;return user?<Layout/>:<Navigate to="/login" replace/>}
function Standalone({children}){const {user,loading}=useAuth();if(loading)return <div className="screen-center">Loading clinic...</div>;return user?children:<Navigate to="/login" replace/>}
function Admin({children}){const {user}=useAuth();return user?.role==='Admin'?children:<Navigate to="/" replace/>}
function Doctor({children}){const {user}=useAuth();return ['Admin','Doctor'].includes(user?.role)?children:<Navigate to="/patients" replace/>}
export default function App(){return <Routes>
 <Route path="/login" element={<Login/>}/>
 <Route path="/print/nabh/:caseId" element={<Standalone><NabhPrint/></Standalone>}/>
 <Route path="/print/invoice/:billingId" element={<Standalone><InvoicePrint/></Standalone>}/>
 <Route element={<Guard/>}>
  <Route index element={<Dashboard/>}/><Route path="patients" element={<Patients/>}/><Route path="patients/:id" element={<PatientProfile/>}/>
  <Route path="patients/:id/consultation" element={<Doctor><Consultation/></Doctor>}/><Route path="patients/:id/cases/:caseId/edit" element={<Doctor><Consultation edit/></Doctor>}/>
  <Route path="today-opd" element={<Appointments today/>}/><Route path="appointments" element={<Appointments/>}/><Route path="investigations" element={<Investigations/>}/><Route path="billing" element={<Billing/>}/><Route path="inventory" element={<Inventory/>}/><Route path="analytics" element={<Analytics/>}/>
  <Route path="staff" element={<Admin><Staff/></Admin>}/><Route path="master-data" element={<Admin><MasterData/></Admin>}/><Route path="activity" element={<Admin><Activity/></Admin>}/><Route path="settings" element={<Admin><SettingsPage/></Admin>}/>
 </Route>
 <Route path="*" element={<Navigate to="/" replace/>}/>
 </Routes>}
