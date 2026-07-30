
export default function PageAlbum({ animals }) {
  const adoptados=animals.filter(a=>a.estado==="adoptado");
  return (
    <div>
      <div className="page-header"><div className="page-title">Álbum de vidas salvadas</div><div className="page-sub">Cada historia importa. Estas son las que terminaron bien.</div></div>
      {adoptados.length===0
        ? <div className="empty"><div className="empty-icon">📸</div><div>Todavía no hay animales adoptados. ¡Pronto habrá historias aquí!</div></div>
        : <div className="album-grid">
            {adoptados.map(a=>(
              <div className="album-card" key={a.id}>
                <div className="album-photo">                {a.foto_url
                  ? <img src={a.foto_url} alt={a.nombre || "animal"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : (a.especie === "gato" ? "🐱" : a.especie === "perro" ? "🐶" : "🐾")}
                  </div>
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
