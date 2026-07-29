import Badge from "./Badge";
import ConfBar from "./ConfBar";

export default function AnimalDetail({ animal, onClose, onEdit }) {
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