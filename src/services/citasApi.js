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

const LOCAL_STORAGE_KEY = "vetcare_citas_data";

const getStoredCitas = () => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialCitas));
    return initialCitas;
  }
  return JSON.parse(data);
};

export const citasApi = {
  getCitas: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getStoredCitas());
      }, 1000);
    });
  },

  createCita: async (nuevaCita) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const citas = getStoredCitas();
        const citaCreada = { id: Date.now(), ...nuevaCita };
        const updated = [citaCreada, ...citas];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        resolve(citaCreada);
      }, 600);
    });
  },

  updateCita: async (id, citaActualizada) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const citas = getStoredCitas();
        const updated = citas.map((c) =>
          c.id === id ? { ...c, ...citaActualizada } : c
        );
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        resolve({ id, ...citaActualizada });
      }, 600);
    });
  },

  deleteCita: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const citas = getStoredCitas();
        const updated = citas.filter((c) => c.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        resolve({ success: true, id });
      }, 500);
    });
  },
};