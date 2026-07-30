import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ESTADO } from "../constants/animals";

// Fix del ícono que Leaflet pierde con Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Íconos por estado
const iconColor = {
  calle:        "red",
  seguimiento:  "orange",
  recuperacion: "blue",
  adopcion:     "violet",
  adoptado:     "green",
};

function makeIcon(estado) {
  const color = iconColor[estado] || "grey";
  return L.divIcon({
    className: "",
    html: `<div style="
      width:28px;height:28px;border-radius:50% 50% 50% 0;
      background:${color === "red" ? "#D94040" : color === "orange" ? "#F5A623" : color === "blue" ? "#1A6FA8" : color === "violet" ? "#3558C8" : "#4A7C59"};
      border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,.35);
      transform:rotate(-45deg);
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
  });
}

export default function PageMapa({ animals, onUpdateAnimal }) {
  const center = [-32.756855, -64.337333];
  const conPin = animals.filter(a => a.lat && a.lng);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Mapa de la comunidad</div>
        <div className="page-sub">
          {conPin.length} de {animals.length} animales tienen ubicación en el mapa.
        </div>
      </div>

      <div style={{ borderRadius: "var(--r)", overflow: "hidden", border: "1px solid var(--border)", height: 420 }}>
        <MapContainer center={center} zoom={14} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {conPin.map(a => (
            <Marker key={a.id} position={[a.lat, a.lng]} icon={makeIcon(a.estado)}>
              <Popup>
                <div style={{ minWidth: 160 }}>
                  <strong>{a.nombre || "Sin nombre"}</strong><br />
                  {ESTADO[a.estado]?.emoji} {ESTADO[a.estado]?.label}<br />
                  <small>{a.ubicacion || ""}</small>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="map-legend" style={{ marginTop: 14 }}>
        {Object.entries(ESTADO).map(([k, v]) => (
          <div className="map-legend-item" key={k}><span>{v.emoji}</span>{v.label}</div>
        ))}
      </div>

      {/* Animales sin pin */}
      {animals.filter(a => !a.lat || !a.lng).length > 0 && (
        <div className="card" style={{ marginTop: 20 }}>
          <div className="section-title">📍 Sin ubicación en el mapa</div>
          <p style={{ fontSize: ".82rem", color: "var(--ink-m)", marginBottom: 12 }}>
            Estos animales no tienen pin. Editálos para asignarles una ubicación.
          </p>
          {animals.filter(a => !a.lat || !a.lng).map(a => (
            <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontSize: ".88rem" }}>{a.especie === "gato" ? "🐱" : "🐶"} {a.nombre || "Sin nombre"} — {a.ubicacion || "sin zona"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}