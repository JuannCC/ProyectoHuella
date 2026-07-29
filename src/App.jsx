import { useEffect, useState } from "react";

import "./styles/global.css";

import PageAnimales from "./pages/PageAnimales";
import PageMapa from "./pages/PageMapa";
import PageImpacto from "./pages/PageImpacto";
import PageAlbum from "./pages/PageAlbum";

import AnimalForm from "./components/AnimalForm";
import AnimalDetail from "./components/AnimalDetail";

import {
  getAnimals,
  createAnimal,
  updateAnimal
} from "./services/animalsService";

export default function App() {

  const [page, setPage] = useState("animales");
  const [animals, setAnimals] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [editAnimal, setEditAnimal] = useState(null);

  useEffect(() => {
    loadAnimals();
  }, []);

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

  function renderPage() {
    switch (page) {
      case "mapa":
        return <PageMapa animals={animals} />;

      case "impacto":
        return <PageImpacto animals={animals} />;

      case "album":
        return <PageAlbum animals={animals} />;

      default:
        return (
          <PageAnimales
            animals={animals}
            onAdd={() => {
              setEditAnimal(null);
              setShowForm(true);
            }}
            onView={(animal) => {
              setSelectedAnimal(animal);
            }}
          />
        );
    }
  }

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-logo">
          🐾 <span>Proyecto Huella</span>
        </div>

        <div className="nav-tabs">
          <button
            className={`nav-tab ${page === "animales" ? "active" : ""}`}
            onClick={() => setPage("animales")}
          >
            Animales
          </button>

          <button
            className={`nav-tab ${page === "mapa" ? "active" : ""}`}
            onClick={() => setPage("mapa")}
          >
            Mapa
          </button>

          <button
            className={`nav-tab ${page === "impacto" ? "active" : ""}`}
            onClick={() => setPage("impacto")}
          >
            Impacto
          </button>

          <button
            className={`nav-tab ${page === "album" ? "active" : ""}`}
            onClick={() => setPage("album")}
          >
            Álbum
          </button>
        </div>
      </nav>

      <main className="main">
        {renderPage()}
      </main>

      {showForm && (
        <AnimalForm
          initial={editAnimal}
          onClose={() => {
            setShowForm(false);
            setEditAnimal(null);
          }}
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