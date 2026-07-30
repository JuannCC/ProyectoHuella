import { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CONF_LABELS } from "../constants/animals";

// Fix íconos Leaflet + Vite (igual que en PageMapa)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Componente interno que escucha clicks en el mapa
function PinSelector({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const CENTER = [-32.756855, -64.337333];

export default function AnimalForm({ initial, onSave, onClose }) {
  const empty = {
    nombre: "", especie: "gato", sexo: "Desconocido", edad: "Adulto",
    estado: "calle", castrado: "Desconocido", salud: "Sano",
    ubicacion: "", fecha: new Date().toISOString().slice(0, 10),
    confianza: 0, responsable: "", notas: "", foto_url: "",
    lat: null, lng: null,
  };
  const [form, setForm]       = useState(initial || empty);
  const [preview, setPreview] = useState(initial?.foto_url || "");
  const fileRef               = useRef();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  function handlePin(lat, lng) {
    setForm(f => ({ ...f, lat, lng }));
  }

  function handleFoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setPreview(ev.target.result);
      set("foto_url", ev.target.result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{initial ? "Editar animal" : "Registrar nuevo animal"}</div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Foto */}
        <div className="form-group">
          <label>📷 Foto del animal</label>
          <div
            onClick={() => fileRef.current.click()}
            style={{ width: "100%", height: 160, borderRadius: 8, overflow: "hidden", border: "2px dashed var(--border)", background: "var(--mist)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            {preview
              ? <img src={preview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <div style={{ textAlign: "center", color: "var(--ink-m)", fontSize: ".85rem" }}>
                  <div style={{ fontSize: "2rem", marginBottom: 6 }}>📷</div>
                  Tocá para sacar o subir una foto
                </div>
            }
          </div>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handleFoto} />
          {preview && <button className="btn btn-secondary btn-sm" style={{ marginTop: 6 }} onClick={() => { setPreview(""); set("foto_url", ""); }}>Quitar foto</button>}
        </div>

        <div className="grid-2">
          <div className="form-group"><label>Nombre (opcional)</label><input type="text" value={form.nombre} onChange={e => set("nombre", e.target.value)} placeholder="Ej: Luna" /></div>
          <div className="form-group"><label>Especie</label><select value={form.especie} onChange={e => set("especie", e.target.value)}><option value="gato">🐱 Gato</option><option value="perro">🐶 Perro</option><option value="otro">🐾 Otro</option></select></div>
          <div className="form-group"><label>Sexo</label><select value={form.sexo} onChange={e => set("sexo", e.target.value)}>{["Macho", "Hembra", "Desconocido"].map(o => <option key={o}>{o}</option>)}</select></div>
          <div className="form-group"><label>Edad aproximada</label><select value={form.edad} onChange={e => set("edad", e.target.value)}>{["Cachorro", "Joven", "Adulto", "Anciano"].map(o => <option key={o}>{o}</option>)}</select></div>
          <div className="form-group"><label>Estado actual</label><select value={form.estado} onChange={e => set("estado", e.target.value)}><option value="calle">🔴 En calle</option><option value="seguimiento">🟠 Seguimiento</option><option value="recuperacion">🔵 Recuperación</option><option value="adopcion">🟣 En adopción</option><option value="adoptado">🟢 Adoptado</option></select></div>
          <div className="form-group"><label>Castrado</label><select value={form.castrado} onChange={e => set("castrado", e.target.value)}>{["Sí", "No", "Pendiente", "Desconocido"].map(o => <option key={o}>{o}</option>)}</select></div>
          <div className="form-group"><label>Salud</label><select value={form.salud} onChange={e => set("salud", e.target.value)}>{["Sano", "Requiere revisión", "Enfermo", "Urgente"].map(o => <option key={o}>{o}</option>)}</select></div>
          <div className="form-group"><label>Fecha de aparición</label><input type="date" value={form.fecha} onChange={e => set("fecha", e.target.value)} /></div>
        </div>

        {/* Mapa para poner pin */}
        <div className="form-group">
          <label>📍 Ubicación en el mapa *</label>
          <p style={{ fontSize: ".78rem", color: "var(--ink-m)", marginBottom: 8 }}>
            Tocá en el mapa para marcar dónde está el animal.
            {form.lat && <span style={{ color: "var(--sage)", marginLeft: 8 }}>✓ Pin colocado</span>}
          </p>
          <div style={{ height: 220, borderRadius: 8, overflow: "hidden", border: `2px solid ${form.lat ? "var(--sage)" : "var(--border)"}` }}>
            <MapContainer
              center={form.lat ? [form.lat, form.lng] : CENTER}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <PinSelector onSelect={handlePin} />
              {form.lat && <Marker position={[form.lat, form.lng]} />}
            </MapContainer>
          </div>
        </div>

        {/* Descripción de zona (texto libre, opcional) */}
        <div className="form-group">
          <label>Zona / referencia (opcional)</label>
          <input type="text" value={form.ubicacion} onChange={e => set("ubicacion", e.target.value)} placeholder="Ej: Barrio Centro, cerca de la plaza" />
        </div>

        <div className="form-group"><label>👤 Responsable del caso</label><input type="text" value={form.responsable} onChange={e => set("responsable", e.target.value)} placeholder="Nombre de quien hace el seguimiento" /></div>

        <div className="form-group">
          <label>Nivel de confianza: {form.confianza} — {CONF_LABELS[form.confianza]}</label>
          <input type="range" min={0} max={5} value={form.confianza} onChange={e => set("confianza", Number(e.target.value))} style={{ width: "100%", accentColor: "var(--amber)" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".72rem", color: "var(--ink-m)" }}>
            <span>0 – No se acerca</span><span>5 – Sociable</span>
          </div>
        </div>

        <div className="form-group"><label>📝 Observaciones</label><textarea value={form.notas} onChange={e => set("notas", e.target.value)} placeholder="Estado de salud, comportamiento, contexto..." /></div>

        <div className="btn-row">
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={() => {
            if (!form.lat) return alert("Marcá la ubicación en el mapa");
            onSave(form);
          }}>
              {initial ? "Guardar cambios" : "Registrar animal"}
          </button>
        </div>
      </div>
    </div>
  );
}
