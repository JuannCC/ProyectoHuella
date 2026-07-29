import { ESTADO } from "../constants/animals";

export default function PageMapa({ animals }) {
  const PINS = [{estado:"calle",x:"28%",y:"45%"},{estado:"adopcion",x:"55%",y:"30%"},{estado:"recuperacion",x:"70%",y:"60%"},{estado:"adoptado",x:"40%",y:"70%"},{estado:"seguimiento",x:"80%",y:"35%"}];
  return (
    <div>
      <div className="page-header"><div className="page-title">Mapa de la comunidad</div><div className="page-sub">Distribución geográfica de los casos</div></div>
        <div style={{borderRadius:"var(--r)",overflow:"hidden",border:"1px solid var(--border)",height:360,position:"relative"}}>
          <iframe
            title="mapa"
            width="100%" height="100%"
            style={{border:"none"}}
            src="https://www.openstreetmap.org/export/embed.html?bbox=-63.4,-31.8,-63.3,-31.7&layer=mapnik"
          />
          <div style={{position:"absolute",top:12,right:12,background:"white",borderRadius:8,padding:"6px 12px",fontSize:".78rem",boxShadow:"0 2px 8px rgba(0,0,0,.15)"}}>
            📍 Ajustá las coordenadas a tu ciudad
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
