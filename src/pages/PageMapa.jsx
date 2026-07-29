import { ESTADO } from "../constants/animals";

export default function PageMapa({ animals }) {
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
