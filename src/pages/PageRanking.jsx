export default function PageRanking({ animals }) {
  const conteo = {};
  animals.forEach(a => {
    const barrio = a.ubicacion || "Sin datos";
    conteo[barrio] = (conteo[barrio] || 0) + 1;
  });

  const sorted = Object.entries(conteo).sort((a, b) => b[1] - a[1]);
  const max = sorted[0]?.[1] || 1;

  const medallas = ["🥇", "🥈", "🥉"];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "var(--font-d)", fontSize: "1.5rem", fontWeight: 700 }}>
          Ranking de barrios
        </h1>
        <p style={{ fontSize: ".88rem", color: "var(--ink-m)", marginTop: 4 }}>
          Zonas con mayor cantidad de rescates registrados.
        </p>
      </div>

      {sorted.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--ink-m)" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>📍</div>
          <div>No hay animales registrados todavía.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sorted.map(([barrio, cant], i) => (
            <div
              key={barrio}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                background: "var(--card)", border: "1px solid var(--border)",
                borderRadius: "var(--r)", padding: "14px 18px",
              }}
            >
              {/* Posición / medalla */}
              <div style={{
                fontFamily: "var(--font-d)", fontWeight: 700,
                fontSize: i < 3 ? "1.5rem" : "1.1rem",
                width: 36, textAlign: "center", flexShrink: 0,
                color: "var(--terra)",
              }}>
                {i < 3 ? medallas[i] : `#${i + 1}`}
              </div>

              {/* Nombre + barra */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: ".95rem", marginBottom: 6 }}>
                  {barrio}
                </div>
                <div style={{
                  height: 8, background: "var(--border)",
                  borderRadius: 4, overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%",
                    width: `${(cant / max) * 100}%`,
                    background: i === 0 ? "var(--terra)" : i === 1 ? "var(--amber)" : "var(--sage)",
                    borderRadius: 4,
                    transition: "width .4s",
                  }} />
                </div>
              </div>

              {/* Número */}
              <div style={{
                fontFamily: "var(--font-d)", fontWeight: 700,
                fontSize: "1.2rem", minWidth: 28, textAlign: "right",
              }}>
                {cant}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resumen al pie */}
      {sorted.length > 0 && (
        <div className="card" style={{ marginTop: 24, textAlign: "center" }}>
          <p style={{ fontSize: ".88rem", color: "var(--ink-m)" }}>
            📍 <strong>{sorted.length}</strong> zona{sorted.length !== 1 ? "s" : ""} con rescates ·{" "}
            🐾 <strong>{animals.length}</strong> animales en total
          </p>
        </div>
      )}
    </div>
  );
}