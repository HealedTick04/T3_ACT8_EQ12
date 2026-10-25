
import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Sparkles,
  UserRound,
} from "lucide-react";
import "./Login.css";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Introduce tu usuario y contraseña.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
          expiresInMins: 30,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "No se pudo iniciar sesión.");
      }

      onLogin(data);
    } catch (err) {
      setError(
        err.message || "No se pudo conectar. Inténtalo nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-layout">
        <div className="login-welcome">
          <div className="welcome-top">
            <div className="brand-mark">
              <Sparkles size={23} />
            </div>
            <span className="brand-name">VetCare<span>.</span></span>
          </div>

          <div className="welcome-content">
            <span className="welcome-eyebrow">
              <span className="status-dot" />
              BIENVENIDO, TEN UN GRANDIOSO DÍA.
            </span>

            <h1>
              Cuidamos de los que más quieres
              <span> VetCare.</span>
            </h1>

            <p>
              Gestiona las consultas, los pacientes y el cuidado
              de las mascotas, todo en uno.
              
            </p>

            <div className = "welcome-image">
              <img src = "/images/logo.png" alt = "logo" className = "logo-image"/>
            </div>
          </div>

          <p className="welcome-footer">
            La forma mas eficiente de gestionar tu clínica veterinaria.
          </p>
        </div>

        <div className="login-form-panel">
          <div className="login-form-container">
            <div className="mobile-brand">
              <div className="brand-mark">
                <Sparkles size={22} />
              </div>
              <span className="brand-name">VetCare<span>.</span></span>
            </div>

            <div className="form-heading">
              <span className="form-kicker">BIENVENIDO DE NUEVO</span>
              <h2>Inicia sesión</h2>
              <p>Introduce tus datos para acceder a tu cuenta.</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-field">
                <label htmlFor="username">Nombre de usuario</label>
                <div className="input-wrapper">
                  <UserRound size={19} />
                  <input
                    id="username"
                    type="text"
                    placeholder="Tu nombre de usuario"
                    autoComplete="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="password">Contraseña</label>
                <div className="input-wrapper">
                  <LockKeyhole size={19} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tu contraseña"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="login-error" role="alert">
                  <span>!</span>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >
                <span>{loading ? "Verificando..." : "Iniciar sesión"}</span>
                {!loading && <ArrowRight size={19} />}
                {loading && <span className="login-spinner" />}
              </button>
            </form>

            <div className="login-demo">
              <span className="demo-icon">
                <LockKeyhole size={16} />
              </span>
              <div>
                <strong>Credenciales de demostración</strong>
                <p>
                  Usuario: <code>emilys</code>
                  {" · "}
                  Contraseña: <code>emilyspass</code>
                </p>
              </div>
            </div>

            <p className="login-legal">
              Acceso de demostración · Proyecto React
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

