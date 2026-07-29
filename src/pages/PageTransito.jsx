import { useState } from "react";

const TRANSITO_SEED = [
  { id:1, nombre:"Ana M.", zona:"Barrio Sur", capacidad:2, actual:1, historico:4, especie:"gato", contacto:"ana@mail.com", disponible:true },
  { id:2, nombre:"Carlos R.", zona:"Barrio Este", capacidad:3, actual:2, historico:7, especie:"cualquiera", contacto:"carlos@mail.com", disponible:true },
  { id:3, nombre:"Laura G.", zona:"Barrio Centro", capacidad:1, actual:1, historico:3, especie:"gato", contacto:"laura@mail.com", disponible:false },
];

export default function Transito() {
  const [hogares, setHogares] = useState(TRANSITO_SEED);
  const [form, setForm] = useState({ nombre:"", zona:"", capacidad:1, especie:"cualquiera", contacto:"" });
  const [mostrarForm, setMostrarForm] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleSubmit = () => {
    if (!form.nombre || !form.zona || !form.contacto) return alert("Completá nombre, zona y contacto");
    setHogares(prev => [...prev, { ...form, id:Date.now(), actual:0, historico:0, disponible:true, capacidad:Number(form.capacidad) }]);
    setMostrarForm(false);
    setForm({ nombre:"", zona:"", capacidad:1, especie:"cualquiera", contacto:"" });
  };

  const totalCapacidad = hogares.reduce((s,h)=>s+h.capacidad,0);
  const totalActual    = hogares.reduce((s,h)=>s+h.actual,0);
  const totalHistorico = hogares.reduce((s,h)=>s+h.historico,0);
  const disponibles    = hogares.filter(h=>h.disponible&&h.actual<h.capacidad).length;

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
        <div>
          <h1 style={{fontFamily:"var(--font-d)",fontSize:"1.5rem",fontWeight:700}}>Hogares de tránsito</h1>
          <p style={{fontSize:".88rem",color:"var(--ink-m)",marginTop:4}}>Personas que acogen animales temporalmente mientras esperan adopción.</p>
        </div>
        <button className="btn btn-primary" onClick={()=>setMostrarForm(v=>!v)}>+ Ofrecerme</button>
      </div>

      {/* Stats rápidas */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
        {[[hogares.length,"🏘️","hogares registrados"],[disponibles,"✅","con lugar disponible"],[totalActual,"🐾","animales hoy"],[totalHistorico,"❤️","pasaron en total"]].map(([n,e,l])=>(
          <div className="stat-card" key={l}><div style={{fontSize:"1.2rem"}}>{e}</div><div style={{fontFamily:"var(--font-d)",fontSize:"1.8rem",fontWeight:700,lineHeight:1.1}}>{n}</div><div style={{fontSize:".75rem",color:"var(--ink-m)",marginTop:4}}>{l}</div></div>
        ))}
      </div>

      {/* Form nuevo hogar */}
      {mostrarForm && (
        <div className="card" style={{marginBottom:20}}>
          <div style={{fontFamily:"var(--font-d)",fontWeight:700,marginBottom:14}}>Registrar hogar de tránsito</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div className="form-group"><label>Tu nombre *</label><input type="text" value={form.nombre} onChange={e=>set("nombre",e.target.value)} placeholder="Ej: María López"/></div>
            <div className="form-group"><label>Zona / Barrio *</label><input type="text" value={form.zona} onChange={e=>set("zona",e.target.value)} placeholder="Ej: Barrio Norte"/></div>
            <div className="form-group"><label>Contacto *</label><input type="text" value={form.contacto} onChange={e=>set("contacto",e.target.value)} placeholder="Email o teléfono"/></div>
            <div className="form-group"><label>Capacidad máxima</label><input type="number" min={1} max={10} value={form.capacidad} onChange={e=>set("capacidad",e.target.value)}/></div>
            <div className="form-group"><label>Especie que podés alojar</label>
              <select value={form.especie} onChange={e=>set("especie",e.target.value)}>
                <option value="cualquiera">Cualquiera</option><option value="gato">Solo gatos</option><option value="perro">Solo perros</option>
              </select>
            </div>
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <button className="btn btn-secondary" onClick={()=>setMostrarForm(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSubmit}>Registrar hogar</button>
          </div>
        </div>
      )}

      {/* Lista de hogares */}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {hogares.map(h => {
          const libre = h.capacidad - h.actual;
          return (
            <div className="card" key={h.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
              <div>
                <div style={{fontWeight:700,fontSize:"1rem"}}>{h.nombre}</div>
                <div style={{fontSize:".78rem",color:"var(--ink-m)",marginTop:2}}>📍 {h.zona} · {h.especie==="cualquiera"?"🐾 Cualquier especie":h.especie==="gato"?"🐱 Solo gatos":"🐶 Solo perros"}</div>
                <div style={{display:"flex",gap:14,marginTop:8,fontSize:".82rem"}}>
                  <span>🐾 <strong>{h.actual}</strong>/{h.capacidad} ahora</span>
                  <span>❤️ <strong>{h.historico}</strong> pasaron en total</span>
                </div>
                {/* Barra visual de ocupación */}
                <div style={{marginTop:8,height:6,width:160,background:"var(--border)",borderRadius:3,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${(h.actual/h.capacidad)*100}%`,background:libre===0?"var(--red)":"var(--sage)",borderRadius:3}}/>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <span className={`badge ${libre>0?"badge-adoptado":"badge-calle"}`}>{libre>0?`${libre} lugar${libre>1?"es":""} libre`:"Sin lugar"}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}