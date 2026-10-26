import React, { useState } from "react";
import "./Dashboard.css";
import {
  Plus,
  Search,
  Filter,
  Calendar as CalendarIcon,
  Edit,
  Trash2,
  X,
} from "lucide-react";
// Datos de prueba iniciales sin api
// Datos de prueba iniciales
const initialCitas = [
  {
    id: 1,
    fecha: "2026-10-28",
    mascota: "Max",
    especie: "Perro",
    dueno: "Carlos Mendoza",
    motivo: "Vacunación anual",
    estado: "Confirmada",
  },
  {
    id: 2,
    fecha: "2026-10-28",
    mascota: "Luna",
    especie: "Gato",
    dueno: "Ana María Torres",
    motivo: "Revisión general",
    estado: "Pendiente",
  },
  {
    id: 3,
    fecha: "2026-10-29",
    mascota: "Tambor",
    especie: "Conejo",
    dueno: "Sofia López",
    motivo: "Corte de uñas",
    estado: "Atendido",
  },
  {
    id: 4,
    fecha: "2026-10-30",
    mascota: "Rocky",
    especie: "Perro",
    dueno: "Luis Gómez",
    motivo: "Limpieza dental",
    estado: "Cancelada",
  },
];

export default function Dashboard({ activePage, user }) {
 const [citas, setCitas] = useState(initialCitas);

  // Estados de Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [filterEspecie, setFilterEspecie] = useState("Todas");
  const [filterFecha, setFilterFecha] = useState("");

  // Estado del Modal y Cita en edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = Crear, número = Editar

  const [formCita, setFormCita] = useState({
    mascota: "",
    especie: "Perro",
    dueno: "",
    motivo: "",
    fecha: "",
    estado: "Pendiente",
  });

  // Abrir modal en modo "Nueva Cita"
  const handleOpenCreateModal = () => {
    setEditingId(null);
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

  // Abrir modal en modo "Editar Cita"
  const handleOpenEditModal = (cita) => {
    setEditingId(cita.id);
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

  // Eliminar cita
  const handleDeleteCita = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta cita?")) {
      setCitas(citas.filter((cita) => cita.id !== id));
    }
  };

  // Guardar (Crear o Actualizar)
  const handleSaveCita = (e) => {
    e.preventDefault();
    if (!formCita.mascota || !formCita.dueno || !formCita.fecha) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    if (editingId) {
      // Modo Edición: Actualizar la cita existente
      setCitas(
        citas.map((cita) =>
          cita.id === editingId ? { ...cita, ...formCita } : cita
        )
      );
    } else {
      // Modo Creación: Agregar nueva cita
      const newCita = {
        id: Date.now(),
        ...formCita,
      };
      setCitas([newCita, ...citas]);
    }

    setIsModalOpen(false);
  };

  // Filtrado dinámico
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
          <h1>Bienvenido, {user.firstName}</h1>
          <p>Has iniciado sesión correctamente.</p>
        </>
      )}

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
                {filteredCitas.length > 0 ? (
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
                            onClick={() => handleDeleteCita(cita.id)}
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

          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-container">
                <div className="modal-header">
                  <h2>{editingId ? "Editar Cita" : "Agendar Nueva Cita"}</h2>
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
                      {editingId ? "Actualizar Cita" : "Guardar Cita"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
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
