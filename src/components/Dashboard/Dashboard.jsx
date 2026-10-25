
import "./Dashboard.css";

export default function Dashboard({ activePage, user }) {
  return (
    <section className="dashboard">
      {activePage === "Inicio" && (
        <>
          <h1>Bienvenido, {user.firstName}</h1>
          <p>Has iniciado sesión correctamente.</p>
        </>
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
