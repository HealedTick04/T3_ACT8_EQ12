
import { useState } from "react";
import Login from "./components/Login/Login";
import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import Dashboard from "./components/Dashboard/Dashboard";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState("Inicio");

  function handleLogout() {
    setUser(null);
    setActivePage("Inicio");
  }

  // Si no hay usuario autenticado, solo mostramos el login.
  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <div className="main-content">
        <Navbar user={user} onLogout={handleLogout} />

        <Dashboard activePage={activePage} user={user} />
      </div>
    </div>
  );
}

