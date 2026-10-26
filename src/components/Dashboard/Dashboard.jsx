import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { citasApi } from "/src/services/citasApi";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import {
  Plus,
  Search,
  Filter,
  Calendar as CalendarIcon,
  Edit,
  Trash2,
  X,
  Loader2,
} from "lucide-react";
// Datos de prueba iniciales sin api
// Datos de prueba iniciales
export default function Dashboard({ activePage, user }) {
  // --- ESTADOS PRINCIPALES DE CITAS ---
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FILTROS ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [filterEspecie, setFilterEspecie] = useState("Todas");
  const [filterFecha, setFilterFecha] = useState("");

  // --- MODALES Y EDICIÓN ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCitaId, setEditingCitaId] = useState(null);
  const [deleteCitaId, setDeleteCitaId] = useState(null);

  // --- FORMULARIO ---
  const [formCita, setFormCita] = useState({
    mascota: "",
    especie: "Perro",
    dueno: "",
    motivo: "",
    fecha: "",
    estado: "Pendiente",
  });

  // --- CARGA DE DATOS DESDE LA API ---
  useEffect(() => {
    if (activePage === "Citas") {
      loadCitas();
    }
  }, [activePage]);

  const loadCitas = async () => {
    setLoading(true);
    try {
      const data = await citasApi.getCitas();
      setCitas(data);
    } catch (error) {
      console.error("Error al cargar citas:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS PARA ABRIR Y CERRAR MODAL ---
  const handleOpenCreateModal = () => {
    setEditingCitaId(null);
    setFormCita({
      mascota: "",
      especie: "Perro",
      dueno: "",
      motivo: "",
      fecha: "",
      estado: "Pendiente",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cita) => {
    setEditingCitaId(cita.id);
    setFormCita({
      mascota: cita.mascota,
      especie: cita.especie,
      dueno: cita.dueno,
      motivo: cita.motivo,
      fecha: cita.fecha,
      estado: cita.estado,
    });
    setIsModalOpen(true);
  };

  // --- GUARDAR (CREAR O ACTUALIZAR) ---
  const handleSaveCita = async (e) => {
    e.preventDefault();

    if (!formCita.mascota.trim() || !formCita.dueno.trim() || !formCita.fecha) {
      alert("Por favor completa los campos obligatorios (*)");
      return;
    }

    try {
      if (editingCitaId) {
        // Actualizar en localStorage vía API
        const citaActualizada = await citasApi.updateCita(editingCitaId, formCita);
        setCitas((prevCitas) =>
          prevCitas.map((c) => (c.id === editingCitaId ? citaActualizada : c))
        );
      } else {
        // Crear en localStorage vía API
        const nuevaCita = await citasApi.createCita(formCita);
        setCitas((prevCitas) => [nuevaCita, ...prevCitas]);
      }

      setIsModalOpen(false);
      setFormCita({
        mascota: "",
        especie: "Perro",
        dueno: "",
        motivo: "",
        fecha: "",
        estado: "Pendiente",
      });
    } catch (error) {
      console.error("Error al guardar la cita:", error);
    }
  };

  // --- ELIMINAR CITA ---
  const handleConfirmDelete = async () => {
    if (deleteCitaId) {
      await citasApi.deleteCita(deleteCitaId);
      setCitas((prevCitas) => prevCitas.filter((c) => c.id !== deleteCitaId));
      setDeleteCitaId(null);
    }
  };

  // --- FILTRADO DINÁMICO ---
  const filteredCitas = citas.filter((cita) => {
    const matchesSearch =
      cita.mascota.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.dueno.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEstado =
      filterEstado === "Todos" || cita.estado === filterEstado;

    const matchesEspecie =
      filterEspecie === "Todas" || cita.especie === filterEspecie;

    const matchesFecha =
      filterFecha === "" || cita.fecha === filterFecha;

    return matchesSearch && matchesEstado && matchesEspecie && matchesFecha;
  });

  return (
    <section className="dashboard">
      {activePage === "Inicio" && (
        <>
          <h1>Bienvenido, {user?.firstName || "Usuario"}</h1>
          <p>Has iniciado sesión correctamente en VetCare.</p>
        </>
      )}

      {/* --- MÓDULO DE CITAS --- */}
      {activePage === "Citas" && (
        <div className="citas-module">
          <header className="citas-header">
            <div>
              <h1>Gestión de Citas Médicas</h1>
              <p>Agenda, filtra y controla las citas de las mascotas.</p>
            </div>
            <button className="btn-primary" onClick={handleOpenCreateModal}>
              <Plus size={18} /> Nueva Cita
            </button>
          </header>

          <div className="citas-toolbar">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar por mascota o dueño..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-box">
              <Filter size={16} />
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
              >
                <option value="Todos">Todos los estados</option>
                <option value="Confirmada">Confirmada</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Atendido">Atendido</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>

            <div className="filter-box">
              <select
                value={filterEspecie}
                onChange={(e) => setFilterEspecie(e.target.value)}
              >
                <option value="Todas">Todas las especies</option>
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
                <option value="Conejo">Conejo</option>
              </select>
            </div>

            <div className="filter-box date-filter">
              <CalendarIcon size={16} />
              <input
                type="date"
                value={filterFecha}
                onChange={(e) => setFilterFecha(e.target.value)}
              />
              {filterFecha && (
                <button
                  className="btn-clear-date"
                  onClick={() => setFilterFecha("")}
                  title="Limpiar fecha"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="table-container">
            <table className="citas-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Mascota</th>
                  <th>Dueño</th>
                  <th>Motivo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="loading-state">
                      <div className="spinner-container">
                        <Loader2 size={24} className="spinner" />
                        <span>Cargando citas...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredCitas.length > 0 ? (
                  filteredCitas.map((cita) => (
                    <tr key={cita.id}>
                      <td>
                        <div className="date-badge">
                          <CalendarIcon size={14} /> {cita.fecha}
                        </div>
                      </td>
                      <td>
                        <strong>{cita.mascota}</strong>
                        <span className="sub-text">{cita.especie}</span>
                      </td>
                      <td>{cita.dueno}</td>
                      <td>{cita.motivo}</td>
                      <td>
                        <span
                          className={`badge badge-${cita.estado.toLowerCase()}`}
                        >
                          {cita.estado}
                        </span>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            className="btn-icon btn-edit"
                            title="Editar cita"
                            onClick={() => handleOpenEditModal(cita)}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            title="Eliminar cita"
                            onClick={() => setDeleteCitaId(cita.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      No se encontraron citas con los filtros aplicados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* MODAL CREAR / EDITAR CITA */}
          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-container">
                <div className="modal-header">
                  <h2>{editingCitaId ? "Editar Cita" : "Agendar Nueva Cita"}</h2>
                  <button
                    className="btn-close-modal"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSaveCita} className="modal-form">
                  <div className="form-group">
                    <label>Nombre de la Mascota *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Firulais"
                      value={formCita.mascota}
                      onChange={(e) =>
                        setFormCita({ ...formCita, mascota: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Especie</label>
                      <select
                        value={formCita.especie}
                        onChange={(e) =>
                          setFormCita({ ...formCita, especie: e.target.value })
                        }
                      >
                        <option value="Perro">Perro</option>
                        <option value="Gato">Gato</option>
                        <option value="Conejo">Conejo</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Nombre del Dueño *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Roberto Gómez"
                        value={formCita.dueno}
                        onChange={(e) =>
                          setFormCita({ ...formCita, dueno: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Fecha de Cita *</label>
                      <input
                        type="date"
                        required
                        value={formCita.fecha}
                        onChange={(e) =>
                          setFormCita({ ...formCita, fecha: e.target.value })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Estado</label>
                      <select
                        value={formCita.estado}
                        onChange={(e) =>
                          setFormCita({ ...formCita, estado: e.target.value })
                        }
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="Confirmada">Confirmada</option>
                        <option value="Atendido">Atendido</option>
                        <option value="Cancelada">Cancelada</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Motivo de la consulta</label>
                    <input
                      type="text"
                      placeholder="Ej. Chequeo de rutina, Vacunación..."
                      value={formCita.motivo}
                      onChange={(e) =>
                        setFormCita({ ...formCita, motivo: e.target.value })
                      }
                    />
                  </div>

                  <div className="modal-actions">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn-primary">
                      {editingCitaId ? "Actualizar Cita" : "Guardar Cita"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
          <ConfirmModal
            isOpen={Boolean(deleteCitaId)}
            title="¿Eliminar cita médica?"
            message="Esta cita se eliminará permanentemente de la lista."
            onConfirm={handleConfirmDelete}
            onClose={() => setDeleteCitaId(null)}
          />
        </div>
      )}
      
      {activePage === "Usuarios" && (
        <>
          <h1>Gestión de usuarios</h1>
          <p>Aquí se integrará la tabla CRUD.</p>
        </>
      )}

      {activePage === "Configuración" && (
        <>
          <h1>Configuración</h1>
          <p>Esta sección estará disponible próximamente.</p>
        </>
      )}
    </section>
  );
}
