import { useEffect, useState } from "react";
import "./styles/global.css";
import PageAnimales from "./pages/PageAnimales";
import PageMapa from "./pages/PageMapa";
import PageImpacto from "./pages/PageImpacto";
import PageAlbum from "./pages/PageAlbum";
import PageAdoptantes from "./pages/PageAdoptantes";
import PageTransito from "./pages/PageTransito";
import AnimalForm from "./components/AnimalForm";
import AnimalDetail from "./components/AnimalDetail";
import { getAnimals, createAnimal, updateAnimal } from "./services/animalsService";

const TABS = [
  { id: "animales",   label: "🐾 Animales" },
  { id: "mapa",       label: "🗺️ Mapa" },
  { id: "impacto",    label: "📊 Impacto" },
  { id: "album",      label: "📸 Álbum" },
  { id: "adoptantes", label: "🏠 Adoptantes" },
  { id: "transito",   label: "🏘️ Tránsito" },
];

export default function App() {
  const [page, setPage]               = useState("animales");
  const [animals, setAnimals]         = useState([]);
  const [showForm, setShowForm]       = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [editAnimal, setEditAnimal]   = useState(null);
  const [menuOpen, setMenuOpen]       = useState(false);

  useEffect(() => { loadAnimals(); }, []);

  async function loadAnimals() {
    try {
      const data = await getAnimals();
      setAnimals(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSave(form) {
    try {
      if (editAnimal) {
        await updateAnimal(editAnimal.id, form);
      } else {
        await createAnimal(form);
      }
      await loadAnimals();
      setShowForm(false);
      setEditAnimal(null);
      setSelectedAnimal(null);
    } catch (err) {
      console.error(err);
      alert("Error al guardar");
    }
  }

  function navigate(id) {
    setPage(id);
    setMenuOpen(false);
  }

  function renderPage() {
    switch (page) {
      case "mapa":       return <PageMapa animals={animals} />;
      case "impacto":    return <PageImpacto animals={animals} />;
      case "album":      return <PageAlbum animals={animals} />;
      case "adoptantes": return <PageAdoptantes />;
      case "transito":   return <PageTransito />;
      default:
        return (
          <PageAnimales
            animals={animals}
            onAdd={() => { setEditAnimal(null); setShowForm(true); }}
            onView={(animal) => setSelectedAnimal(animal)}
          />
        );
    }
  }

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-logo">🐾 <span>Proyecto Huella</span></div>

        {/* Desktop tabs */}
        <div className="nav-tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`nav-tab ${page === t.id ? "active" : ""}`}
              onClick={() => navigate(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Hamburguesa mobile */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Menú"
        >
          <span style={{ transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
          <span style={{ opacity: menuOpen ? 0 : 1 }} />
          <span style={{ transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
        </button>
      </nav>

      {/* Menú mobile desplegable */}
      {menuOpen && (
        <div className="mobile-menu">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`mobile-tab ${page === t.id ? "active" : ""}`}
              onClick={() => navigate(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <main className="main">{renderPage()}</main>

      {showForm && (
        <AnimalForm
          initial={editAnimal}
          onClose={() => { setShowForm(false); setEditAnimal(null); }}
          onSave={handleSave}
        />
      )}

      {selectedAnimal && (
        <AnimalDetail
          animal={selectedAnimal}
          onClose={() => setSelectedAnimal(null)}
          onEdit={() => {
            setEditAnimal(selectedAnimal);
            setSelectedAnimal(null);
            setShowForm(true);
          }}
        />
      )}
    </div>
  );
}