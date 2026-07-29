import { ESTADO } from "../constants/animals";

export default function PageImpacto({ animals }) {
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
