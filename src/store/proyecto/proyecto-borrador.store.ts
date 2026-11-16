"use client";

import { create } from "zustand";

// Datos que queremos recuperar
interface ProyectoBorrador {
    nombre: string;
    descripcion: string;
    portada: File | null;
}

interface ProyectoBorradorStore {
    borrador: ProyectoBorrador;
    actualizarBorrador: (datos: Partial<ProyectoBorrador>) => void; // Actualiza los valores del borrador
    limpiarBorrador: () => void; // Reestablece los valores iniciales
}

const crearBorradorVacio = (): ProyectoBorrador => ({
    nombre: "",
    descripcion: "",
    portada: null,
});

export const useProyectoBorradorStore = create<ProyectoBorradorStore>()(
    (set) => ({
        borrador: crearBorradorVacio(),

        actualizarBorrador: (datos) =>
            set((estado) => ({
                borrador: {
                    ...estado.borrador,
                    ...datos,
                },
            })),

        limpiarBorrador: () =>
            set({ borrador: crearBorradorVacio() }),
    })
);