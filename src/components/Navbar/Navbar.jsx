
import "./Navbar.css";

export default function Navbar({ user, onLogout }) {
  const fullName = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <header className="navbar">
      <div>
        <strong>Panel administrativo</strong>
      </div>

      <div className="user-info">
        <img
          src={user.image}
          alt="Foto de perfil"
          className="profile-image"
        />

        <span>{fullName || user.username}</span>

        <button onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
