import { useState } from "react";
import { CONF_LABELS } from "../constants/animals";

export default function AnimalForm({ initial, onSave, onClose }) {
  const empty = { nombre:"", especie:"gato", sexo:"Desconocido", edad:"Adulto", estado:"calle", castrado:"Desconocido", salud:"Sano", ubicacion:"", fecha:new Date().toISOString().slice(0,10), confianza:0, responsable:"", notas:"" };
  const [form, setForm] = useState(initial||empty);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{initial?"Editar animal":"Registrar nuevo animal"}</div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="grid-2">
          <div className="form-group"><label>Nombre (opcional)</label><input type="text" value={form.nombre} onChange={e=>set("nombre",e.target.value)} placeholder="Ej: Luna"/></div>
          <div className="form-group"><label>Especie</label><select value={form.especie} onChange={e=>set("especie",e.target.value)}><option value="gato">🐱 Gato</option><option value="perro">🐶 Perro</option><option value="otro">🐾 Otro</option></select></div>
          <div className="form-group"><label>Sexo</label><select value={form.sexo} onChange={e=>set("sexo",e.target.value)}>{["Macho","Hembra","Desconocido"].map(o=><option key={o}>{o}</option>)}</select></div>
          <div className="form-group"><label>Edad aproximada</label><select value={form.edad} onChange={e=>set("edad",e.target.value)}>{["Cachorro","Joven","Adulto","Anciano"].map(o=><option key={o}>{o}</option>)}</select></div>
          <div className="form-group"><label>Estado actual</label><select value={form.estado} onChange={e=>set("estado",e.target.value)}><option value="calle">🔴 En calle</option><option value="seguimiento">🟠 Seguimiento</option><option value="recuperacion">🔵 Recuperación</option><option value="adopcion">🟣 En adopción</option><option value="adoptado">🟢 Adoptado</option></select></div>
          <div className="form-group"><label>Castrado</label><select value={form.castrado} onChange={e=>set("castrado",e.target.value)}>{["Sí","No","Pendiente","Desconocido"].map(o=><option key={o}>{o}</option>)}</select></div>
          <div className="form-group"><label>Salud</label><select value={form.salud} onChange={e=>set("salud",e.target.value)}>{["Sano","Requiere revisión","Enfermo","Urgente"].map(o=><option key={o}>{o}</option>)}</select></div>
          <div className="form-group"><label>Fecha de aparición</label><input type="date" value={form.fecha} onChange={e=>set("fecha",e.target.value)}/></div>
        </div>
        <div className="form-group"><label>📍 Ubicación *</label><input type="text" value={form.ubicacion} onChange={e=>set("ubicacion",e.target.value)} placeholder="Ej: Calle San Martín 400, Barrio Centro"/></div>
        <div className="form-group"><label>👤 Responsable del caso</label><input type="text" value={form.responsable} onChange={e=>set("responsable",e.target.value)} placeholder="Nombre de quien hace el seguimiento"/></div>
        <div className="form-group">
          <label>Nivel de confianza: {form.confianza} — {CONF_LABELS[form.confianza]}</label>
          <input type="range" min={0} max={5} value={form.confianza} onChange={e=>set("confianza",Number(e.target.value))} style={{width:"100%",accentColor:"var(--amber)"}}/>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:".72rem",color:"var(--ink-m)"}}><span>0 – No se acerca</span><span>5 – Sociable</span></div>
        </div>
        <div className="form-group"><label>📝 Observaciones</label><textarea value={form.notas} onChange={e=>set("notas",e.target.value)} placeholder="Estado de salud, comportamiento, contexto..."/></div>
        <div className="btn-row">
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={()=>{ if(!form.ubicacion) return alert("Indicá la ubicación"); onSave(form); }}>{initial?"Guardar cambios":"Registrar animal"}</button>
        </div>
      </div>
    </div>
  );
}
