import { ESTADO } from "../constants/animals";

export default function PageMapa({ animals }) {
  // Bbox calculado alrededor de -32.756855, -64.337333 con ~2km de margen
  const src = "https://www.openstreetmap.org/export/embed.html?bbox=-64.3573,-32.7769,-64.3174,-32.7368&layer=mapnik&marker=-32.756855,-64.337333";

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Mapa de la comunidad</div>
        <div className="page-sub">Distribución geográfica de los casos</div>
      </div>

      <div style={{ borderRadius: "var(--r)", overflow: "hidden", border: "1px solid var(--border)", height: 380, position: "relative" }}>
        <iframe
          title="mapa"
          width="100%"
          height="100%"
          style={{ border: "none" }}
          src={src}
        />
      </div>

      <div className="map-legend" style={{ marginTop: 14 }}>
        {Object.entries(ESTADO).map(([k, v]) => (
          <div className="map-legend-item" key={k}>
            <span>{v.emoji}</span>{v.label}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24 }}>
        <div className="section-title">Resumen por zona</div>
        <div className="grid-2" style={{ gap: 12, marginTop: 10 }}>
          {(() => {
            const conteo = {};
            animals.forEach(a => {
              const zona = a.ubicacion || "Sin datos";
              conteo[zona] = (conteo[zona] || 0) + 1;
            });
            const sorted = Object.entries(conteo).sort((a, b) => b[1] - a[1]).slice(0, 6);
            return sorted.length > 0
              ? sorted.map(([zona, cant]) => (
                  <div className="card" key={zona} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: ".88rem" }}>📍 {zona}</span>
                    <span style={{ fontFamily: "var(--font-d)", fontWeight: 700, fontSize: "1.1rem" }}>{cant}</span>
                  </div>
                ))
              : <div style={{ color: "var(--ink-m)", fontSize: ".88rem" }}>No hay animales registrados todavía.</div>;
          })()}
        </div>
      </div>
    </div>
  );
}