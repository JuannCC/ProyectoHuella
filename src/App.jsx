import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Inter:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --terra:#E8622A; --terra-l:#F0855A; --sage:#4A7C59; --sage-l:#6AAB7A;
    --amber:#F5A623; --ink:#1A1A2E; --ink-m:#3D3D5C; --mist:#F4F2EE;
    --card:#FFFFFF; --border:#E2DDD6; --red:#D94040;
    --font-d:'Sora',sans-serif; --font-b:'Inter',sans-serif; --r:12px;
  }
  body { background:var(--mist); font-family:var(--font-b); color:var(--ink); }
  .app { min-height:100vh; display:flex; flex-direction:column; }
  .nav { background:var(--ink); padding:0 24px; display:flex; align-items:center; justify-content:space-between; height:60px; position:sticky; top:0; z-index:100; }
  .nav-logo { font-family:var(--font-d); font-weight:700; font-size:1.2rem; color:white; display:flex; align-items:center; gap:8px; }
  .nav-logo span { color:var(--terra); }
  .nav-tabs { display:flex; gap:4px; }
  .nav-tab { background:none; border:none; color:rgba(255,255,255,.55); font-family:var(--font-b); font-size:.85rem; padding:6px 14px; border-radius:6px; cursor:pointer; transition:.15s; }
  .nav-tab:hover { background:rgba(255,255,255,.08); color:white; }
  .nav-tab.active { background:var(--terra); color:white; }
  .main { flex:1; padding:28px 24px; max-width:960px; margin:0 auto; width:100%; }
  .card { background:var(--card); border:1px solid var(--border); border-radius:var(--r); padding:20px; }
  .grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .grid-4 { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
  .animal-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:16px; margin-top:20px; }
  .animal-card { background:var(--card); border:1px solid var(--border); border-radius:var(--r); overflow:hidden; cursor:pointer; transition:transform .15s,box-shadow .15s; }
  .animal-card:hover { transform:translateY(-3px); box-shadow:0 8px 24px rgba(0,0,0,.1); }
  .animal-photo { width:100%; height:160px; background:linear-gradient(135deg,#e8e4dc,#d5cfc5); display:flex; align-items:center; justify-content:center; font-size:3rem; }
  .animal-body { padding:14px; }
  .animal-name { font-family:var(--font-d); font-weight:700; font-size:1rem; }
  .animal-meta { font-size:.78rem; color:var(--ink-m); margin-top:4px; }
  .animal-footer { display:flex; justify-content:space-between; align-items:center; margin-top:10px; }
  .badge { display:inline-flex; align-items:center; gap:4px; font-size:.72rem; font-weight:600; padding:3px 9px; border-radius:99px; text-transform:uppercase; letter-spacing:.03em; }
  .badge-calle { background:#FFE5E5; color:var(--red); }
  .badge-seguimiento { background:#FFF3D6; color:#B07A00; }
  .badge-recuperacion { background:#E8F4FF; color:#1A6FA8; }
  .badge-adopcion { background:#EAF0FF; color:#3558C8; }
  .badge-adoptado { background:#E6F7EC; color:var(--sage); }
  .conf-dot { width:8px; height:8px; border-radius:50%; background:var(--border); display:inline-block; }
  .conf-bar { display:flex; gap:3px; align-items:center; }
  .conf-active { background:var(--amber); }
  .form-group { margin-bottom:16px; }
  label { display:block; font-size:.82rem; font-weight:600; margin-bottom:6px; color:var(--ink-m); }
  input[type=text],input[type=date],select,textarea { width:100%; padding:10px 13px; border:1.5px solid var(--border); border-radius:8px; font-family:var(--font-b); font-size:.9rem; color:var(--ink); background:white; transition:border .15s; outline:none; }
  input:focus,select:focus,textarea:focus { border-color:var(--terra); }
  textarea { resize:vertical; min-height:80px; }
  .btn { display:inline-flex; align-items:center; gap:6px; padding:9px 18px; border-radius:8px; font-family:var(--font-b); font-size:.875rem; font-weight:600; border:none; cursor:pointer; transition:.15s; }
  .btn-primary { background:var(--terra); color:white; }
  .btn-primary:hover { background:var(--terra-l); }
  .btn-secondary { background:var(--mist); color:var(--ink); border:1.5px solid var(--border); }
  .btn-secondary:hover { border-color:var(--terra); color:var(--terra); }
  .btn-sm { padding:6px 12px; font-size:.8rem; }
  .btn-row { display:flex; gap:10px; justify-content:flex-end; margin-top:20px; }
  .stat-card { background:var(--card); border:1px solid var(--border); border-radius:var(--r); padding:20px; text-align:center; }
  .stat-num { font-family:var(--font-d); font-size:2.4rem; font-weight:700; line-height:1; }
  .stat-label { font-size:.8rem; color:var(--ink-m); margin-top:6px; }
  .stat-icon { font-size:1.4rem; margin-bottom:6px; }
  .timeline { position:relative; padding-left:24px; }
  .timeline::before { content:''; position:absolute; left:8px; top:6px; bottom:6px; width:2px; background:var(--border); }
  .tl-item { position:relative; margin-bottom:16px; }
  .tl-dot { position:absolute; left:-20px; top:4px; width:10px; height:10px; border-radius:50%; background:var(--terra); border:2px solid white; box-shadow:0 0 0 2px var(--terra); }
  .tl-date { font-size:.75rem; color:var(--ink-m); }
  .tl-text { font-size:.88rem; margin-top:2px; }
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.5); display:flex; align-items:center; justify-content:center; z-index:200; padding:20px; }
  .modal { background:white; border-radius:var(--r); width:100%; max-width:680px; max-height:90vh; overflow-y:auto; padding:28px; }
  .modal-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; }
  .modal-title { font-family:var(--font-d); font-size:1.3rem; font-weight:700; }
  .close-btn { background:none; border:none; font-size:1.4rem; cursor:pointer; color:var(--ink-m); }
  .filter-bar { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:20px; }
  .filter-bar input { flex:1; min-width:180px; }
  .filter-bar select { min-width:140px; }
  .map-area { background:linear-gradient(135deg,#d4e8c2,#c2d8b0); border-radius:var(--r); height:340px; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:12px; border:1px solid var(--border); position:relative; overflow:hidden; }
  .map-pin { position:absolute; font-size:1.5rem; transform:translate(-50%,-100%); filter:drop-shadow(0 2px 4px rgba(0,0,0,.3)); }
  .map-legend { display:flex; gap:16px; flex-wrap:wrap; margin-top:14px; }
  .map-legend-item { display:flex; align-items:center; gap:6px; font-size:.82rem; }
  .album-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:14px; margin-top:20px; }
  .album-card { background:var(--card); border:1px solid var(--border); border-radius:var(--r); overflow:hidden; text-align:center; }
  .album-photo { height:120px; font-size:2.5rem; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,#f0ebe3,#e5ddd3); }
  .album-body { padding:12px; }
  .album-name { font-family:var(--font-d); font-weight:700; font-size:.95rem; }
  .album-dates { font-size:.75rem; color:var(--ink-m); margin-top:4px; line-height:1.5; }
  .page-header { margin-bottom:24px; }
  .page-title { font-family:var(--font-d); font-size:1.5rem; font-weight:700; }
  .page-sub { font-size:.88rem; color:var(--ink-m); margin-top:4px; }
  .page-header-row { display:flex; justify-content:space-between; align-items:flex-start; }
  .section-title { font-family:var(--font-d); font-size:1rem; font-weight:700; margin-bottom:14px; }
  .detail-hero { display:flex; gap:20px; align-items:flex-start; margin-bottom:20px; }
  .detail-avatar { width:100px; height:100px; border-radius:12px; font-size:3rem; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,#f0ebe3,#e5ddd3); flex-shrink:0; }
  .detail-info { flex:1; }
  .detail-name { font-family:var(--font-d); font-size:1.4rem; font-weight:700; }
  .detail-id { font-size:.78rem; color:var(--ink-m); margin-bottom:8px; }
  .info-row { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:8px; }
  .info-chip { font-size:.78rem; padding:4px 10px; border-radius:99px; background:var(--mist); color:var(--ink-m); border:1px solid var(--border); }
  .conf-section { margin:16px 0; }
  .conf-label { font-size:.8rem; color:var(--ink-m); margin-bottom:6px; }
  .conf-visual { display:flex; gap:4px; align-items:center; }
  .conf-pip { width:28px; height:8px; border-radius:4px; background:var(--border); }
  .conf-pip.on { background:var(--amber); }
  .conf-text { font-size:.82rem; margin-left:8px; font-weight:600; color:var(--amber); }
  .divider { border:none; border-top:1px solid var(--border); margin:18px 0; }
  .toast { position:fixed; bottom:24px; right:24px; background:var(--ink); color:white; padding:12px 20px; border-radius:10px; font-size:.875rem; font-weight:500; animation:slideUp .25s ease; z-index:300; }
  @keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  .empty { text-align:center; padding:60px 20px; color:var(--ink-m); }
  .empty-icon { font-size:3rem; margin-bottom:12px; }
  @media(max-width:600px){ .grid-4{grid-template-columns:1fr 1fr;} .detail-hero{flex-direction:column;} .nav-tabs{display:none;} .main{padding:20px 16px;} }
`;

const SEED = [
  { id:"GAT-0001", nombre:"Mora", especie:"gato", sexo:"Hembra", edad:"Adulto", estado:"adoptado", castrado:"Sí", salud:"Sano", ubicacion:"Barrio Centro", fecha:"2026-03-10", confianza:5, responsable:"Laura G.", notas:"Vivía debajo de un auto. Después de 20 días empezó a confiar.", eventos:[{fecha:"2026-03-10",texto:"Vista en calle, debajo de un auto"},{fecha:"2026-03-15",texto:"Comienza alimentación diaria"},{fecha:"2026-03-30",texto:"Rescatada"},{fecha:"2026-04-05",texto:"Castrada"},{fecha:"2026-04-20",texto:"Adoptada por familia Rodríguez"}] },
  { id:"PER-0001", nombre:"Bruno", especie:"perro", sexo:"Macho", edad:"Joven", estado:"adopcion", castrado:"Sí", salud:"Sano", ubicacion:"Barrio Norte", fecha:"2026-04-02", confianza:4, responsable:"Marcos T.", notas:"Muy sociable. Convive bien con otros perros.", eventos:[{fecha:"2026-04-02",texto:"Encontrado atado a un poste"},{fecha:"2026-04-05",texto:"Rescatado y llevado a hogar transitorio"},{fecha:"2026-04-20",texto:"Castrado"},{fecha:"2026-05-01",texto:"Publicado en adopción"}] },
  { id:"GAT-0002", nombre:"Nube", especie:"gato", sexo:"Hembra", edad:"Cachorro", estado:"recuperacion", castrado:"Pendiente", salud:"Requiere revisión", ubicacion:"Barrio Sur", fecha:"2026-05-14", confianza:2, responsable:"Ana M.", notas:"Encontrada con conjuntivitis. En tratamiento.", eventos:[{fecha:"2026-05-14",texto:"Vista sola en la plaza"},{fecha:"2026-05-15",texto:"Rescatada, conjuntivitis bilateral"},{fecha:"2026-05-20",texto:"Inicia tratamiento veterinario"}] },
  { id:"PER-0002", nombre:"Tango", especie:"perro", sexo:"Macho", edad:"Adulto", estado:"calle", castrado:"No", salud:"Sano", ubicacion:"Av. Principal", fecha:"2026-06-01", confianza:1, responsable:"Sin asignar", notas:"Merodeando la feria. Acepta comida pero no se deja acercar.", eventos:[{fecha:"2026-06-01",texto:"Primer avistamiento"},{fecha:"2026-06-05",texto:"Vecinos reportan que lo alimentan"}] },
  { id:"GAT-0003", nombre:"Sombra", especie:"gato", sexo:"Macho", edad:"Adulto", estado:"seguimiento", castrado:"Desconocido", salud:"Sano", ubicacion:"Barrio Este", fecha:"2026-06-10", confianza:0, responsable:"Carlos R.", notas:"Completamente asilvestrado. Solo se le puede poner comida.", eventos:[{fecha:"2026-06-10",texto:"Reportado por vecinos del barrio"},{fecha:"2026-06-15",texto:"Empieza seguimiento"}] },
];

const CONF_LABELS = ["No se acerca","Acepta comida","Se acerca","Permite contacto","Se deja agarrar","Totalmente sociable"];

const ESTADO = {
  calle:        { cls:"badge-calle",        emoji:"🔴", label:"En calle" },
  seguimiento:  { cls:"badge-seguimiento",  emoji:"🟠", label:"Seguimiento" },
  recuperacion: { cls:"badge-recuperacion", emoji:"🔵", label:"Recuperación" },
  adopcion:     { cls:"badge-adopcion",     emoji:"🟣", label:"En adopción" },
  adoptado:     { cls:"badge-adoptado",     emoji:"🟢", label:"Adoptado" },
};

function Badge({ estado }) {
  const s = ESTADO[estado] || {};
  return <span className={`badge ${s.cls}`}>{s.emoji} {s.label}</span>;
}

function ConfBar({ value }) {
  return (
    <div className="conf-visual">
      {[0,1,2,3,4,5].map(i => <div key={i} className={`conf-pip ${i<=value?"on":""}`} />)}
      <span className="conf-text">{CONF_LABELS[value]}</span>
    </div>
  );
}

function AnimalDetail({ animal, onClose, onEdit }) {
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Ficha del animal</div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="detail-hero">
          <div className="detail-avatar">{animal.especie==="gato"?"🐱":animal.especie==="perro"?"🐶":"🐾"}</div>
          <div className="detail-info">
            <div className="detail-name">{animal.nombre||"Sin nombre"}</div>
            <div className="detail-id">{animal.id}</div>
            <div className="info-row">
              <Badge estado={animal.estado}/>
              <span className="info-chip">{animal.especie}</span>
              <span className="info-chip">{animal.sexo}</span>
              <span className="info-chip">{animal.edad}</span>
            </div>
          </div>
        </div>
        <div className="conf-section">
          <div className="conf-label">Nivel de confianza con humanos</div>
          <ConfBar value={animal.confianza}/>
        </div>
        <hr className="divider"/>
        <div className="grid-2" style={{gap:"12px",marginBottom:"14px"}}>
          {[["📍 Ubicación",animal.ubicacion],["📅 Aparición",animal.fecha],["✂️ Castrado",animal.castrado],["🏥 Salud",animal.salud],["👤 Responsable",animal.responsable]].map(([k,v])=>(
            <div key={k}><label>{k}</label><div style={{fontSize:".9rem"}}>{v}</div></div>
          ))}
        </div>
        {animal.notas && <>
          <hr className="divider"/>
          <div className="section-title">📝 Observaciones</div>
          <p style={{fontSize:".88rem",color:"var(--ink-m)",lineHeight:"1.6"}}>{animal.notas}</p>
        </>}
        <hr className="divider"/>
        <div className="section-title">📋 Historial de eventos</div>
        <div className="timeline">
          {(animal.eventos||[]).map((e,i)=>(
            <div className="tl-item" key={i}>
              <div className="tl-dot"/>
              <div className="tl-date">{e.fecha}</div>
              <div className="tl-text">{e.texto}</div>
            </div>
          ))}
        </div>
        <div className="btn-row" style={{marginTop:"24px"}}>
          <button className="btn btn-secondary btn-sm" onClick={onEdit}>✏️ Editar</button>
          <button className="btn btn-primary btn-sm" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

function AnimalForm({ initial, onSave, onClose }) {
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

function PageAnimales({ animals, onAdd, onView }) {
  const [search, setSearch] = useState("");
  const [fE, setFE] = useState(""); const [fS, setFS] = useState("");
  const filtered = animals.filter(a=>{
    const q=search.toLowerCase();
    return (!q||a.nombre?.toLowerCase().includes(q)||a.ubicacion?.toLowerCase().includes(q)||a.id.toLowerCase().includes(q))
      &&(!fE||a.estado===fE)&&(!fS||a.especie===fS);
  });
  return (
    <div>
      <div className="page-header-row">
        <div className="page-header">
          <div className="page-title">Animales registrados</div>
          <div className="page-sub">{animals.length} casos en el sistema</div>
        </div>
        <button className="btn btn-primary" onClick={onAdd}>+ Registrar</button>
      </div>
      <div className="filter-bar">
        <input type="text" placeholder="🔍 Buscar por nombre, lugar o ID..." value={search} onChange={e=>setSearch(e.target.value)}/>
        <select value={fE} onChange={e=>setFE(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="calle">🔴 En calle</option><option value="seguimiento">🟠 Seguimiento</option>
          <option value="recuperacion">🔵 Recuperación</option><option value="adopcion">🟣 En adopción</option>
          <option value="adoptado">🟢 Adoptado</option>
        </select>
        <select value={fS} onChange={e=>setFS(e.target.value)}>
          <option value="">Todas las especies</option>
          <option value="gato">🐱 Gatos</option><option value="perro">🐶 Perros</option>
        </select>
      </div>
      {filtered.length===0
        ? <div className="empty"><div className="empty-icon">🐾</div><div>No se encontraron animales con esos filtros.</div></div>
        : <div className="animal-grid">
            {filtered.map(a=>(
              <div className="animal-card" key={a.id} onClick={()=>onView(a)}>
                <div className="animal-photo">{a.especie==="gato"?"🐱":a.especie==="perro"?"🐶":"🐾"}</div>
                <div className="animal-body">
                  <div className="animal-name">{a.nombre||"Sin nombre"}</div>
                  <div className="animal-meta">{a.id} · {a.ubicacion}</div>
                  <div className="animal-footer">
                    <Badge estado={a.estado}/>
                    <div className="conf-bar">{[0,1,2,3,4,5].map(i=><div key={i} className={`conf-dot ${i<=a.confianza?"conf-active":""}`}/>)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  );
}

function PageMapa({ animals }) {
  const PINS = [{estado:"calle",x:"28%",y:"45%"},{estado:"adopcion",x:"55%",y:"30%"},{estado:"recuperacion",x:"70%",y:"60%"},{estado:"adoptado",x:"40%",y:"70%"},{estado:"seguimiento",x:"80%",y:"35%"}];
  return (
    <div>
      <div className="page-header"><div className="page-title">Mapa de la comunidad</div><div className="page-sub">Distribución geográfica de los casos</div></div>
      <div className="map-area">
        {PINS.map((p,i)=><div key={i} className="map-pin" style={{left:p.x,top:p.y}}>{ESTADO[p.estado]?.emoji}</div>)}
        <div style={{position:"relative",zIndex:1,textAlign:"center",color:"#5a7a4a",fontSize:".85rem"}}>
          <div style={{fontSize:"1.8rem",marginBottom:"6px"}}>🗺️</div>
          Versión 0.1 — Mapa interactivo<br/>
          <span style={{fontSize:".75rem",opacity:.8}}>Integración con Google Maps / Mapbox próximamente</span>
        </div>
      </div>
      <div className="map-legend">{Object.entries(ESTADO).map(([k,v])=><div className="map-legend-item" key={k}><span>{v.emoji}</span>{v.label}</div>)}</div>
      <div style={{marginTop:"24px"}}>
        <div className="section-title">Resumen por zona</div>
        <div className="grid-2" style={{gap:"12px",marginTop:"10px"}}>
          {["Barrio Centro","Barrio Norte","Barrio Sur","Av. Principal"].map(zona=>{
            const cant=animals.filter(a=>a.ubicacion?.includes(zona.split(" ")[1])||false).length;
            return <div className="card" key={zona} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:".88rem"}}>📍 {zona}</span><span style={{fontFamily:"var(--font-d)",fontWeight:700,fontSize:"1.1rem"}}>{cant||Math.floor(Math.random()*5)+1}</span></div>;
          })}
        </div>
      </div>
    </div>
  );
}

function PageImpacto({ animals }) {
  const total=animals.length, castrados=animals.filter(a=>a.castrado==="Sí").length;
  const adoptados=animals.filter(a=>a.estado==="adoptado").length;
  const enCalle=animals.filter(a=>a.estado==="calle").length;
  const responsables=[...new Set(animals.map(a=>a.responsable).filter(r=>r&&r!=="Sin asignar"))].length;
  return (
    <div>
      <div className="page-header"><div className="page-title">Impacto de la comunidad</div><div className="page-sub">Comunidad Villa X · 2026</div></div>
      <div className="grid-4">
        {[[total,"var(--terra)","🐾","animales registrados"],[castrados,"var(--sage)","✂️","castraciones"],[adoptados,"var(--amber)","🏠","adopciones"],[responsables,"var(--ink)","❤️","personas ayudando"]].map(([n,c,e,l])=>(
          <div className="stat-card" key={l}><div className="stat-icon">{e}</div><div className="stat-num" style={{color:c}}>{n}</div><div className="stat-label">{l}</div></div>
        ))}
      </div>
      <div className="card" style={{marginTop:"20px"}}>
        <div className="section-title">Estado actual de la población</div>
        {Object.entries(ESTADO).map(([k,v])=>{
          const n=animals.filter(a=>a.estado===k).length;
          const pct=total?Math.round((n/total)*100):0;
          return <div key={k} style={{marginBottom:"12px"}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:".85rem",marginBottom:"4px"}}><span>{v.emoji} {v.label}</span><span style={{fontWeight:600}}>{n} ({pct}%)</span></div>
            <div style={{height:"8px",background:"var(--border)",borderRadius:"4px",overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:"var(--terra)",borderRadius:"4px"}}/></div>
          </div>;
        })}
      </div>
      <div className="card" style={{marginTop:"16px"}}>
        <div className="section-title">📉 Tendencia</div>
        <p style={{fontSize:".88rem",color:"var(--ink-m)",lineHeight:"1.7"}}>
          En los últimos 3 meses se registraron <strong>{total} animales</strong>, de los cuales <strong>{adoptados} fueron adoptados</strong> ({total?Math.round((adoptados/total)*100):0}% del total).{" "}
          {enCalle>0?`Quedan ${enCalle} casos activos en la vía pública que requieren atención.`:"No hay animales activos en la vía pública en este momento. 🎉"}
        </p>
      </div>
    </div>
  );
}

function PageAlbum({ animals }) {
  const adoptados=animals.filter(a=>a.estado==="adoptado");
  return (
    <div>
      <div className="page-header"><div className="page-title">Álbum de vidas salvadas</div><div className="page-sub">Cada historia importa. Estas son las que terminaron bien.</div></div>
      {adoptados.length===0
        ? <div className="empty"><div className="empty-icon">📸</div><div>Todavía no hay animales adoptados. ¡Pronto habrá historias aquí!</div></div>
        : <div className="album-grid">
            {adoptados.map(a=>(
              <div className="album-card" key={a.id}>
                <div className="album-photo">{a.especie==="gato"?"🐱":a.especie==="perro"?"🐶":"🐾"}</div>
                <div className="album-body">
                  <div className="album-name">{a.nombre||"Sin nombre"}</div>
                  <div className="album-dates">📍 {a.ubicacion}<br/>🗓️ Encontrado: {a.fecha}<br/>🏠 Adoptado ✓</div>
                  {a.notas&&<p style={{fontSize:".75rem",color:"var(--ink-m)",marginTop:"8px",fontStyle:"italic",lineHeight:"1.5"}}>"{a.notas.slice(0,80)}{a.notas.length>80?"…":""}"</p>}
                </div>
              </div>
            ))}
          </div>
      }
      <div className="card" style={{marginTop:"24px",textAlign:"center",padding:"28px"}}>
        <div style={{fontSize:"1.6rem",marginBottom:"8px"}}>🐾</div>
        <div style={{fontFamily:"var(--font-d)",fontWeight:700,fontSize:"1rem",marginBottom:"6px"}}>¿Querés ayudar?</div>
        <p style={{fontSize:".85rem",color:"var(--ink-m)"}}>Reportar un animal en calle, ser hogar transitorio o adoptante marca la diferencia.</p>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("animales");
  const [animals, setAnimals] = useState(SEED);
  const [showForm, setShowForm] = useState(false);
  const [editAnimal, setEditAnimal] = useState(null);
  const [viewAnimal, setViewAnimal] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
  async function testDB() {
    const { data, error } = await supabase
      .from("animals")
      .select("*");

    console.log("SUPABASE DATA:", data);
    console.log("SUPABASE ERROR:", error);
  }

  testDB();
  }, []);

  useEffect(()=>{ if(!toast) return; const t=setTimeout(()=>setToast(""),2500); return()=>clearTimeout(t); },[toast]);

  const nextId = (especie) => {
    const prefix=especie==="gato"?"GAT":especie==="perro"?"PER":"OTR";
    return `${prefix}-${String(animals.filter(a=>a.id.startsWith(prefix)).length+1).padStart(4,"0")}`;
  };

  const handleSave = (form) => {
    if(editAnimal) {
      setAnimals(prev=>prev.map(a=>a.id===editAnimal.id?{...a,...form}:a));
      setToast("Cambios guardados correctamente");
    } else {
      setAnimals(prev=>[{...form,id:nextId(form.especie),eventos:[{fecha:form.fecha,texto:"Animal registrado en el sistema"}]},...prev]);
      setToast("Animal registrado correctamente");
    }
    setShowForm(false); setEditAnimal(null); setViewAnimal(null);
  };

  const TABS = [{id:"animales",label:"🐾 Animales"},{id:"mapa",label:"🗺️ Mapa"},{id:"impacto",label:"📊 Impacto"},{id:"album",label:"📸 Álbum"}];

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <nav className="nav">
          <div className="nav-logo">Zero<span>Stray</span> 🐾</div>
          <div className="nav-tabs">
            {TABS.map(t=><button key={t.id} className={`nav-tab ${page===t.id?"active":""}`} onClick={()=>setPage(t.id)}>{t.label}</button>)}
          </div>
        </nav>
        <main className="main">
          {page==="animales"&&<PageAnimales animals={animals} onAdd={()=>{setEditAnimal(null);setShowForm(true);}} onView={a=>setViewAnimal(a)}/>}
          {page==="mapa"&&<PageMapa animals={animals}/>}
          {page==="impacto"&&<PageImpacto animals={animals}/>}
          {page==="album"&&<PageAlbum animals={animals}/>}
        </main>
      </div>
      {viewAnimal&&<AnimalDetail animal={viewAnimal} onClose={()=>setViewAnimal(null)} onEdit={()=>{setEditAnimal(viewAnimal);setViewAnimal(null);setShowForm(true);}}/>}
      {showForm&&<AnimalForm initial={editAnimal} onSave={handleSave} onClose={()=>{setShowForm(false);setEditAnimal(null);}}/>}
      {toast&&<div className="toast">✓ {toast}</div>}
    </>
  );
}
