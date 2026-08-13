import {X} from 'lucide-react';
export function Modal({open,onClose,title,children,wide=false}){if(!open)return null;return <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose?.()}><div className={`modal ${wide?'modal-wide':''}`}><div className="modal-head"><div><h3>{title}</h3></div><button className="icon-btn" onClick={onClose}><X size={18}/></button></div><div className="modal-body">{children}</div></div></div>}
export function Field({label,children,hint}){return <label className="field"><span>{label}</span>{children}{hint&&<small>{hint}</small>}</label>}
export function Empty({children='No records found.'}){return <div className="empty-state">{children}</div>}
export function Status({children}){const v=String(children||'').toLowerCase().replaceAll(' ','-');return <span className={`status status-${v}`}>{children}</span>}
export function Alert({type='success',children,onClose}){return <div className={`alert ${type}`}>{children}{onClose&&<button onClick={onClose}>×</button>}</div>}
