import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import emailjs from "@emailjs/browser";
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
  Send,
} from "lucide-react";

export default function Dashboard({ activePage, user }) {
  // --- MÓDULO DE CITAS ---
  const [citas, setCitas] = useState([]);
  const [loadingCitas, setLoadingCitas] = useState(false);

  // Filtros Citas
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [filterEspecie, setFilterEspecie] = useState("Todas");
  const [filterFecha, setFilterFecha] = useState("");

  // Modales Citas
  const [isCitaModalOpen, setIsCitaModalOpen] = useState(false);
  const [editingCitaId, setEditingCitaId] = useState(null);
  const [deleteCitaId, setDeleteCitaId] = useState(null);

  const [formCita, setFormCita] = useState({
    mascota: "",
    especie: "Perro",
    dueno: "",
    motivo: "",
    fecha: "",
    estado: "Pendiente",
  });

  useEffect(() => {
    if (activePage === "Citas") {
      loadCitas();
    }
  }, [activePage]);

  const loadCitas = async () => {
    setLoadingCitas(true);
    try {
      const data = await citasApi.getCitas();
      setCitas(data);
    } catch (error) {
      console.error("Error al cargar citas:", error);
    } finally {
      setLoadingCitas(false);
    }
  };

  const handleOpenCreateCitaModal = () => {
    setEditingCitaId(null);
    setFormCita({
      mascota: "",
      especie: "Perro",
      dueno: "",
      motivo: "",
      fecha: "",
      estado: "Pendiente",
    });
    setIsCitaModalOpen(true);
  };

  const handleOpenEditCitaModal = (cita) => {
    setEditingCitaId(cita.id);
    setFormCita({ ...cita });
    setIsCitaModalOpen(true);
  };

  const handleSaveCita = async (e) => {
    e.preventDefault();
    if (!formCita.mascota.trim() || !formCita.dueno.trim() || !formCita.fecha) {
      alert("Por favor completa los campos obligatorios (*)");
      return;
    }

    try {
      if (editingCitaId) {
        const citaActualizada = await citasApi.updateCita(editingCitaId, formCita);
        setCitas((prev) => prev.map((c) => (c.id === editingCitaId ? citaActualizada : c)));
      } else {
        const nuevaCita = await citasApi.createCita(formCita);
        setCitas((prev) => [nuevaCita, ...prev]);
      }
      setIsCitaModalOpen(false);
    } catch (error) {
      console.error("Error al guardar la cita:", error);
    }
  };

  const handleConfirmDeleteCita = async () => {
    if (deleteCitaId) {
      await citasApi.deleteCita(deleteCitaId);
      setCitas((prev) => prev.filter((c) => c.id !== deleteCitaId));
      setDeleteCitaId(null);
    }
  };

  const filteredCitas = citas.filter((cita) => {
    const matchesSearch =
      cita.mascota.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.dueno.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = filterEstado === "Todos" || cita.estado === filterEstado;
    const matchesEspecie = filterEspecie === "Todas" || cita.especie === filterEspecie;
    const matchesFecha = filterFecha === "" || cita.fecha === filterFecha;
    return matchesSearch && matchesEstado && matchesEspecie && matchesFecha;
  });
  // --- MÓDULO DE USUARIOS ---
  const [usuarios, setUsuarios] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchUser, setSearchUser] = useState("");

  // Modales Usuarios
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);

  const [userForm, setUserForm] = useState({
    nombre: "",
    email: "",
    rol: "Veterinario",
    telefono: "",
    estado: "Activo",
  });

  // Petición condicional: solo carga usuarios al seleccionar la vista "Usuarios"
  useEffect(() => {
    if (activePage === "Usuarios" && usuarios.length === 0) {
      fetchUsuarios();
    }
  }, [activePage]);

  const fetchUsuarios = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch("https://dummyjson.com/users?limit=5");
      const data = await response.json();
      const usuariosFormateados = data.users.map((u) => ({
        id: u.id,
        nombre: `${u.firstName} ${u.lastName}`,
        email: u.email,
        telefono: u.phone,
        rol: u.company?.title || "Veterinario",
        estado: "Activo",
      }));
      setUsuarios(usuariosFormateados);
    } catch (error) {
      console.error("Error al cargar usuarios de DummyJSON:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleOpenUserModal = (userToEdit = null) => {
    if (userToEdit) {
      setCurrentUser(userToEdit);
      setUserForm({ ...userToEdit });
    } else {
      setCurrentUser(null);
      setUserForm({
        nombre: "",
        email: "",
        rol: "Veterinario",
        telefono: "",
        estado: "Activo",
      });
    }
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (currentUser) {
      setUsuarios((prev) =>
        prev.map((u) => (u.id === currentUser.id ? { ...userForm, id: currentUser.id } : u))
      );
    } else {
      setUsuarios((prev) => [{ ...userForm, id: Date.now() }, ...prev]);
    }
    setIsUserModalOpen(false);
  };

  const handleConfirmDeleteUser = () => {
    if (deleteUserId) {
      setUsuarios((prev) => prev.filter((u) => u.id !== deleteUserId));
      setDeleteUserId(null);
    }
  };

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.rol.toLowerCase().includes(searchUser.toLowerCase())
  );
  // --- MÓDULO DE MENSAJES ---
  const [formMensaje, setFormMensaje] = useState({
    destinatario: "",
    asunto: "",
    descripcion: "",
  });
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);
  const [sentEmailTo, setSentEmailTo] = useState("");

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setSendingEmail(true);
    setEmailStatus(null);

    const SERVICE_ID = "service_zp9djbf";
    const TEMPLATE_ID = "template_t5svfif";
    const PUBLIC_KEY = "LiLG15pixNm_MuA9V";

    try {
      const response = await fetch("https://dog.ceo/api/breeds/image/random");
      const data = await response.json();

      const templateParams = {
        to_email: formMensaje.destinatario,
        from_subject: formMensaje.asunto,
        message: formMensaje.descripcion,
        dog_image: data.message,
      };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

      setSentEmailTo(formMensaje.destinatario);
      setEmailStatus("success");
      setFormMensaje({ destinatario: "", asunto: "", descripcion: "" });
    } catch (error) {
      console.error("Error al enviar el correo con EmailJS:", error);
      setEmailStatus("error");
    } finally {
      setSendingEmail(false);
    }
  };
  // --- RENDERIZADO ---
  return (
    <section className="dashboard">
      {activePage === "Inicio" && (
        <>
          <h1>Bienvenido, {user?.firstName || "Usuario"}</h1>
          <p>Has iniciado sesión correctamente en VetCare.</p>
        </>
      )}

      {/* VISTA: CITAS */}
      {activePage === "Citas" && (
        <div className="citas-module">
          <header className="citas-header">
            <div>
              <h1>Citas</h1>
              <p>Agenda, filtra y controla las citas de las mascotas.</p>
            </div>
            <button className="btn-primary" onClick={handleOpenCreateCitaModal}>
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
              <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)}>
                <option value="Todos">Todos los estados</option>
                <option value="Confirmada">Confirmada</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Atendido">Atendido</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>

            <div className="filter-box">
              <select value={filterEspecie} onChange={(e) => setFilterEspecie(e.target.value)}>
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
                {loadingCitas ? (
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
                        <span className={`badge badge-${cita.estado.toLowerCase()}`}>
                          {cita.estado}
                        </span>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            className="btn-icon btn-edit"
                            title="Editar cita"
                            onClick={() => handleOpenEditCitaModal(cita)}
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

          {/* Modal Crear / Editar Cita */}
          {isCitaModalOpen && (
            <div className="modal-overlay">
              <div className="modal-container">
                <div className="modal-header">
                  <h2>{editingCitaId ? "Editar Cita" : "Agendar Nueva Cita"}</h2>
                  <button className="btn-close-modal" onClick={() => setIsCitaModalOpen(false)}>
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
                      onChange={(e) => setFormCita({ ...formCita, mascota: e.target.value })}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Especie</label>
                      <select
                        value={formCita.especie}
                        onChange={(e) => setFormCita({ ...formCita, especie: e.target.value })}
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
                        onChange={(e) => setFormCita({ ...formCita, dueno: e.target.value })}
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
                        onChange={(e) => setFormCita({ ...formCita, fecha: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Estado</label>
                      <select
                        value={formCita.estado}
                        onChange={(e) => setFormCita({ ...formCita, estado: e.target.value })}
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
                      onChange={(e) => setFormCita({ ...formCita, motivo: e.target.value })}
                    />
                  </div>

                  <div className="modal-actions">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setIsCitaModalOpen(false)}
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

          <ConfirmModal
            isOpen={Boolean(deleteCitaId)}
            title="¿Eliminar cita?"
            message="Esta cita se eliminará permanentemente de la lista."
            onConfirm={handleConfirmDeleteCita}
            onClose={() => setDeleteCitaId(null)}
          />
        </div>
      )}

      {/* VISTA: USUARIOS */}
      {activePage === "Usuarios" && (
        <div className="citas-module">
          <header className="citas-header">
            <div>
              <h1>Usuarios</h1>
              <p>Administra el personal, veterinarios y permisos del sistema VetCare.</p>
            </div>
            <button className="btn-primary" onClick={() => handleOpenUserModal()}>
              <Plus size={18} /> Nuevo Usuario
            </button>
          </header>

          <div className="citas-toolbar">
            <div className="search-box">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Buscar usuario por nombre, email o rol..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
              />
            </div>
          </div>

          <div className="table-container">
            <table className="citas-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loadingUsers ? (
                  <tr>
                    <td colSpan="6" className="loading-state">
                      <div className="spinner-container">
                        <Loader2 size={20} className="spinner" /> Cargando usuarios desde la API...
                      </div>
                    </td>
                  </tr>
                ) : usuariosFiltrados.length > 0 ? (
                  usuariosFiltrados.map((u) => (
                    <tr key={u.id}>
                      <td><strong>{u.nombre}</strong></td>
                      <td>{u.email}</td>
                      <td>{u.telefono}</td>
                      <td>
                        <span className="badge badge-atendido">{u.rol}</span>
                      </td>
                      <td>
                        <span className={`badge ${u.estado === "Activo" ? "badge-confirmada" : "badge-cancelada"}`}>
                          {u.estado}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button className="btn-icon btn-edit" title="Editar" onClick={() => handleOpenUserModal(u)}>
                          <Edit size={16} />
                        </button>
                        <button className="btn-icon btn-delete" title="Eliminar" onClick={() => setDeleteUserId(u.id)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      No se encontraron usuarios registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Modal Crear / Editar Usuario */}
          {isUserModalOpen && (
            <div className="modal-overlay">
              <div className="modal-container">
                <div className="modal-header">
                  <h2>{currentUser ? "Editar Usuario" : "Nuevo Usuario"}</h2>
                  <button className="btn-close-modal" onClick={() => setIsUserModalOpen(false)}>
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSaveUser} className="modal-form">
                  <div className="form-group">
                    <label>Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Dr. Roberto Gómez"
                      value={userForm.nombre}
                      onChange={(e) => setUserForm({ ...userForm, nombre: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      placeholder="ejemplo@vetcare.com"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Teléfono *</label>
                      <input
                        type="text"
                        required
                        placeholder="555-0000"
                        value={userForm.telefono}
                        onChange={(e) => setUserForm({ ...userForm, telefono: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Rol *</label>
                      <select
                        value={userForm.rol}
                        onChange={(e) => setUserForm({ ...userForm, rol: e.target.value })}
                      >
                        <option value="Veterinario">Veterinario</option>
                        <option value="Recepcionista">Recepcionista</option>
                        <option value="Administrador">Administrador</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Estado *</label>
                    <select
                      value={userForm.estado}
                      onChange={(e) => setUserForm({ ...userForm, estado: e.target.value })}
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>

                  <div className="modal-actions">
                    <button type="button" className="btn-secondary" onClick={() => setIsUserModalOpen(false)}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn-primary">
                      {currentUser ? "Guardar Cambios" : "Crear Usuario"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <ConfirmModal
            isOpen={Boolean(deleteUserId)}
            title="¿Eliminar usuario?"
            message="Este usuario se eliminará permanentemente del sistema VetCare."
            onConfirm={handleConfirmDeleteUser}
            onClose={() => setDeleteUserId(null)}
          />
        </div>
      )}

      {/* VISTA: MENSAJES */}
      {activePage === "Mensajes" && (
        <div className="citas-module">
          <header className="citas-header">
            <div>
              <h1>Envío de Correos</h1>
              <p>Notifica a tus clientes enviando mensajes mediante correo.</p>
            </div>
          </header>

          <div style={{ maxWidth: "600px", margin: "20px 0" }}>
            {emailStatus === "success" && (
              <div style={{ padding: "12px", backgroundColor: "#d4edda", color: "#155724", borderRadius: "8px", marginBottom: "15px" }}>
                ¡Correo enviado con éxito a <strong>{sentEmailTo}</strong>! 🎉
              </div>
            )}

            {emailStatus === "error" && (
              <div style={{ padding: "12px", backgroundColor: "#f8d7da", color: "#721c24", borderRadius: "8px", marginBottom: "15px" }}>
                Hubo un error al enviar el correo. Por favor reintenta. ❌
              </div>
            )}

            <form
              onSubmit={handleSendEmail}
              className="modal-form"
              style={{ background: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e5e7eb" }}
            >
              <div className="form-group">
                <label>Correo Destinatario *</label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  value={formMensaje.destinatario}
                  onChange={(e) => setFormMensaje({ ...formMensaje, destinatario: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Asunto del Correo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Recordatorio de cita médica"
                  value={formMensaje.asunto}
                  onChange={(e) => setFormMensaje({ ...formMensaje, asunto: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Descripción / Mensaje *</label>
                <textarea
                  required
                  rows="5"
                  placeholder="Escribe aquí el contenido de tu mensaje..."
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", resize: "vertical" }}
                  value={formMensaje.descripcion}
                  onChange={(e) => setFormMensaje({ ...formMensaje, descripcion: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={sendingEmail}
                style={{ width: "100%", marginTop: "10px", justifyContent: "center" }}
              >
                {sendingEmail ? (
                  <>
                    <Loader2 size={18} className="spinner" /> Enviando...
                  </>
                ) : (
                  <>
                    <Send size={18} /> Enviar Mensaje
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
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