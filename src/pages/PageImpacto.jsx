import { ESTADO } from "../constants/animals";

export default function PageImpacto({ animals }) {
  const total        = animals.length;
  const castrados    = animals.filter(a => a.castrado === "Sí").length;
  const adoptados    = animals.filter(a => a.estado === "adoptado").length;
  const enCalle      = animals.filter(a => a.estado === "calle").length;
  const responsables = [...new Set(animals.map(a => a.responsable).filter(r => r && r !== "Sin asignar"))].length;

  // Ranking barrios
  const conteo = {};
  animals.forEach(a => {
    const b = a.ubicacion || "Sin datos";
    conteo[b] = (conteo[b] || 0) + 1;
  });
  const ranking = Object.entries(conteo).sort((a, b) => b[1] - a[1]);
  const maxRanking = ranking[0]?.[1] || 1;
  const medallas = ["🥇", "🥈", "🥉"];

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Impacto de la comunidad</div>
        <div className="page-sub">Comunidad Villa X · 2026</div>
      </div>

      {/* Stats */}
      <div className="grid-4">
        {[
          [total,        "var(--terra)", "🐾", "animales registrados"],
          [castrados,    "var(--sage)",  "✂️", "castraciones"],
          [adoptados,    "var(--amber)", "🏠", "adopciones"],
          [responsables, "var(--ink)",   "❤️", "personas ayudando"],
        ].map(([n, c, e, l]) => (
          <div className="stat-card" key={l}>
            <div className="stat-icon">{e}</div>
            <div className="stat-num" style={{ color: c }}>{n}</div>
            <div className="stat-label">{l}</div>
          </div>
        ))}
      </div>

      {/* Distribución por estado */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="section-title">Estado actual de la población</div>
        {Object.entries(ESTADO).map(([k, v]) => {
          const n   = animals.filter(a => a.estado === k).length;
          const pct = total ? Math.round((n / total) * 100) : 0;
          return (
            <div key={k} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".85rem", marginBottom: 4 }}>
                <span>{v.emoji} {v.label}</span>
                <span style={{ fontWeight: 600 }}>{n} ({pct}%)</span>
              </div>
              <div style={{ height: 8, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: "var(--terra)", borderRadius: 4 }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Ranking barrios */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="section-title">🏆 Ranking de barrios</div>
        {ranking.length === 0
          ? <p style={{ fontSize: ".88rem", color: "var(--ink-m)" }}>Sin datos todavía.</p>
          : ranking.map(([barrio, cant], i) => (
              <div key={barrio} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ fontFamily: "var(--font-d)", fontWeight: 700, fontSize: i < 3 ? "1.3rem" : "1rem", width: 34, textAlign: "center", flexShrink: 0, color: "var(--terra)" }}>
                  {i < 3 ? medallas[i] : `#${i + 1}`}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: ".88rem", marginBottom: 4 }}>{barrio}</div>
                  <div style={{ height: 7, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(cant / maxRanking) * 100}%`, background: i === 0 ? "var(--terra)" : i === 1 ? "var(--amber)" : "var(--sage)", borderRadius: 4 }} />
                  </div>
                </div>
                <div style={{ fontFamily: "var(--font-d)", fontWeight: 700, fontSize: "1.1rem", minWidth: 24, textAlign: "right" }}>
                  {cant}
                </div>
              </div>
            ))
        }
      </div>

      {/* Tendencia */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="section-title">📉 Tendencia</div>
        <p style={{ fontSize: ".88rem", color: "var(--ink-m)", lineHeight: 1.7 }}>
          En los últimos 3 meses se registraron <strong>{total} animales</strong>, de los cuales{" "}
          <strong>{adoptados} fueron adoptados</strong> ({total ? Math.round((adoptados / total) * 100) : 0}% del total).{" "}
          {enCalle > 0
            ? `Quedan ${enCalle} casos activos en la vía pública que requieren atención.`
            : "No hay animales activos en la vía pública en este momento. 🎉"}
        </p>
      </div>
    </div>
  );
}