import { useState } from "react";
import Badge from "../components/Badge";

export default function PageAnimales({ animals, onAdd, onView }) {
  const [search, setSearch] = useState("");
  const [fE, setFE] = useState(""); const [fS, setFS] = useState("");
  
  const filtered = animals.filter(a => {
  const q = search.toLowerCase();

  return (
    !q ||
    a.nombre?.toLowerCase().includes(q) ||
    a.ubicacion?.toLowerCase().includes(q) ||
    String(a.id).includes(q)
  ) &&
  (!fE || a.estado === fE) &&
  (!fS || a.especie === fS);
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
