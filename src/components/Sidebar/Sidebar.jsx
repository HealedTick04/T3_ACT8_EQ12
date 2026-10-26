

import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Calendar, // <--- 1. Importamos el icono de Calendario
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import "./Sidebar.css";

const menuItems = [
  { id: "Inicio", label: "Inicio", icon: LayoutDashboard },
  { id: "Citas", label: "Citas", icon: Calendar },
  { id: "Usuarios", label: "Usuarios", icon: Users },
  { id: "Configuración", label: "Configuración", icon: Settings },
];

export default function Sidebar({ activePage, onNavigate }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <Sparkles size={21} />
          </div>

          {!collapsed && (
            <div className="sidebar-brand-text">
              <span className="sidebar-brand-name">
                VetCare<span>.</span>
              </span>
              <span className="sidebar-brand-caption">WORKSPACE</span>
            </div>
          )}
        </div>

        <button
          type="button"
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expandir menú" : "Contraer menú"}
          aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
        >
          {collapsed ? (
            <PanelLeftOpen size={19} />
          ) : (
            <PanelLeftClose size={19} />
          )}
        </button>
      </div>

      <div className="sidebar-section-label">
        {!collapsed && "MENÚ PRINCIPAL"}
      </div>

      <nav className="sidebar-nav" aria-label="Navegación principal">
        {menuItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`menu-item ${
              activePage === id ? "menu-item-active" : ""
            }`}
            onClick={() => onNavigate(id)}
            title={collapsed ? label : undefined}
            aria-current={activePage === id ? "page" : undefined}
          >
            <span className="menu-icon">
              <Icon size={20} strokeWidth={1.9} />
            </span>

            {!collapsed && (
              <>
                <span className="menu-label">{label}</span>
                {activePage === id && (
                  <ChevronRight className="menu-chevron" size={16} />
                )}
              </>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        {!collapsed && (
          <div className="sidebar-tip">
            <div className="sidebar-tip-icon">
              <Sparkles size={17} />
            </div>
            <strong>Todo en orden</strong>
            <p>Tu espacio de trabajo está listo.</p>
          </div>
        )}

        <div className="sidebar-version">
          <span className="version-dot" />
          {!collapsed && <span>Workspace · v1.0</span>}
        </div>
      </div>
    </aside>
  );
}
