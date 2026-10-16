import { useState, type FormEvent } from "react";
import ErrorState from "../ErrorState";
interface Props { initialName?: string; onSubmit: (name: string) => Promise<void>; onCancel: () => void }
export default function AuthorForm({ initialName="", onSubmit, onCancel }: Props) {
 const [name,setName]=useState(initialName); const [error,setError]=useState(""); const [saving,setSaving]=useState(false);
 async function submit(e:FormEvent){e.preventDefault();setError("");if(!name.trim()){setError("Author name is required.");return}setSaving(true);try{await onSubmit(name.trim())}catch(err){setError(err instanceof Error?err.message:"Unable to save author")}finally{setSaving(false)}}
 return <form onSubmit={submit}><div className="mb-3"><label className="form-label">Author name</label><input className="form-control" value={name} onChange={e=>setName(e.target.value)} maxLength={150} required/></div>{error&&<ErrorState message={error}/>}<div className="d-flex justify-content-end gap-2"><button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button><button className="btn btn-primary" disabled={saving}>{saving?"Saving…":"Save author"}</button></div></form>;
}
