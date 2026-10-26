import React from "react";
import { AlertTriangle, X } from "lucide-react";
import "./ConfirmModal.css";

export default function ConfirmModal({ isOpen, title, message, onConfirm, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-container">
        <button className="confirm-close" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="confirm-content">
          <div className="confirm-icon-warning">
            <AlertTriangle size={28} />
          </div>

          <h3>{title || "¿Estás seguro?"}</h3>
          <p>{message || "Esta acción no se puede deshacer."}</p>

          <div className="confirm-actions">
            <button className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn-danger" onClick={onConfirm}>
              Sí, eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}