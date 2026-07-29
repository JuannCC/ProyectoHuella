import { useState } from "react";

const ESPERA_SEED = [
  { id: 1, nombre: "Familia García", contacto: "garcia@mail.com", especie: "gato", fecha: "2026-06-01", notas: "Tenemos patio, sin otros animales" },
  { id: 2, nombre: "Marcos T.", contacto: "marcos@mail.com", especie: "perro", fecha: "2026-06-10", notas: "Buscamos perro mediano" },
];

export default function Adoptantes() {
  const [lista, setLista] = useState(ESPERA_SEED);
  const [form, setForm] = useState({ nombre:"", contacto:"", especie:"cualquiera", notas:"" });
  const [enviado, setEnviado] = useState(false);

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleSubmit = () => {
    if (!form.nombre || !form.contacto) return alert("Completá nombre y contacto");
    setLista(prev => [...prev, { ...form, id: Date.now(), fecha: new Date().toISOString().slice(0,10) }]);
    setEnviado(true);
    setForm({ nombre:"", contacto:"", especie:"cualquiera", notas:"" });
    setTimeout(() => setEnviado(false), 3000);
  };

  return (
    <div>
      <div style={{marginBottom:24}}>
        <h1 style={{fontFamily:"var(--font-d)",fontSize:"1.5rem",fontWeight:700}}>Lista de espera — Adoptantes</h1>
        <p style={{fontSize:".88rem",color:"var(--ink-m)",marginTop:4}}>Anotate y te avisamos cuando haya un animal compatible.</p>
      </div>

      {/* Formulario */}
      <div className="card" style={{marginBottom:24}}>
        <div style={{fontFamily:"var(--font-d)",fontWeight:700,marginBottom:16}}>Quiero adoptar 🏠</div>
        {enviado && <div style={{background:"#e6f7ec",color:"#2d7a4a",padding:"10px 14px",borderRadius:8,marginBottom:14,fontSize:".88rem"}}>✓ ¡Te anotamos! Te contactaremos cuando haya un animal compatible.</div>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <div className="form-group"><label>Tu nombre *</label><input type="text" value={form.nombre} onChange={e=>set("nombre",e.target.value)} placeholder="Ej: Laura García"/></div>
          <div className="form-group"><label>Email o teléfono *</label><input type="text" value={form.contacto} onChange={e=>set("contacto",e.target.value)} placeholder="Ej: laura@mail.com"/></div>
          <div className="form-group"><label>¿Qué animal buscás?</label>
            <select value={form.especie} onChange={e=>set("especie",e.target.value)}>
              <option value="cualquiera">Cualquiera 🐾</option>
              <option value="gato">Gato 🐱</option>
              <option value="perro">Perro 🐶</option>
            </select>
          </div>
        </div>
        <div className="form-group"><label>Contanos sobre vos (vivienda, otros animales, experiencia...)</label><textarea value={form.notas} onChange={e=>set("notas",e.target.value)} placeholder="Ej: Tenemos patio, somos una familia con niños..."/></div>
        <div style={{display:"flex",justifyContent:"flex-end"}}>
          <button className="btn btn-primary" onClick={handleSubmit}>Anotarme en lista de espera</button>
        </div>
      </div>

      {/* Lista actual */}
      <div style={{fontFamily:"var(--font-d)",fontWeight:700,marginBottom:12}}>En espera ({lista.length})</div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {lista.map(p => (
          <div className="card" key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            <div>
              <div style={{fontWeight:600}}>{p.nombre}</div>
              <div style={{fontSize:".78rem",color:"var(--ink-m)"}}>Anotado el {p.fecha} · Busca: {p.especie}</div>
              {p.notas && <div style={{fontSize:".78rem",color:"var(--ink-m)",marginTop:4,fontStyle:"italic"}}>"{p.notas}"</div>}
            </div>
            <span style={{fontSize:".75rem",padding:"3px 10px",borderRadius:99,background:"#eaf0ff",color:"#3558c8",fontWeight:600}}>En espera</span>
          </div>
        ))}
      </div>
    </div>
  );
}