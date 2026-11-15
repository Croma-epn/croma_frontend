"use client";

import { create } from "zustand";
import {
    iniciarSesion as solicitarInicioSesion,
    type ResultadoInicioSesion,
} from "@/actions/inicio-sesion/iniciar-sesion";
import {
    restaurarSesion as solicitarRestauracion,
    type ResultadoRestauracionSesion,
} from "@/actions/inicio-sesion/restaurar-sesion";
import {
    cerrarSesion as solicitarCierreSesion,
    type ResultadoCierreSesion,
} from "@/actions/inicio-sesion/cerrar-sesion";
import type { CredencialesInicioSesion } from "@/interfaces/autenticacion/autenticacion";
import type { Usuario } from "@/interfaces/usuario/usuario";

type EstadoSesion =
    | "sin-comprobar"
    | "comprobando"
    | "autenticado"
    | "no-autenticado"
    | "error";

interface AutenticacionStore {
    usuario: Usuario | null;
    estado: EstadoSesion;
    mensajeError: string | null;
    iniciandoSesion: boolean;
    cerrandoSesion: boolean;
    iniciarSesion: (credenciales: CredencialesInicioSesion) => Promise<ResultadoInicioSesion>;
    restaurarSesion: () => Promise<ResultadoRestauracionSesion>;
    cerrarSesion: () => Promise<ResultadoCierreSesion>;
}

export const useAutenticacionStore = create<AutenticacionStore>()((set, get) => {
    // Serializa operaciones para que una restauración no sobrescriba un logout.
    let cola: Promise<unknown> = Promise.resolve();
    let restauracionEnCurso: Promise<ResultadoRestauracionSesion> | null = null;
    let inicioEnCurso: Promise<ResultadoInicioSesion> | null = null;
    let cierreEnCurso: Promise<ResultadoCierreSesion> | null = null;

    function encolar<T>(operacion: () => Promise<T>): Promise<T> {
        const pendiente = cola.then(operacion);
        cola = pendiente.catch(() => undefined);
        return pendiente;
    }

    return {
        usuario: null,
        estado: "sin-comprobar",
        mensajeError: null,
        iniciandoSesion: false,
        cerrandoSesion: false,

        iniciarSesion: (credenciales) => {
            if (inicioEnCurso) return inicioEnCurso;

            inicioEnCurso = encolar(async () => {
                set({ iniciandoSesion: true, mensajeError: null });
                try {
                    const resultado = await solicitarInicioSesion(credenciales);
                    if (resultado.ok) {
                        set({ usuario: resultado.usuario, estado: "autenticado", mensajeError: null });
                    } else {
                        set({ mensajeError: resultado.mensaje ?? null });
                    }
                    return resultado;
                } finally {
                    set({ iniciandoSesion: false });
                }
            }).finally(() => { inicioEnCurso = null; });

            return inicioEnCurso;
        },

        restaurarSesion: () => {
            if (restauracionEnCurso) return restauracionEnCurso;

            restauracionEnCurso = encolar(async (): Promise<ResultadoRestauracionSesion> => {
                const { usuario, estado } = get();
                // Un login exitoso ya dejó la sesión lista; no hace falta renovarla.
                if (estado === "autenticado" && usuario) return { ok: true, usuario };

                set({ estado: "comprobando", mensajeError: null });
                const resultado = await solicitarRestauracion();

                if (resultado.ok) {
                    set({ usuario: resultado.usuario, estado: "autenticado", mensajeError: null });
                } else if (resultado.motivo === "sin-sesion") {
                    set({ usuario: null, estado: "no-autenticado", mensajeError: null });
                } else {
                    set({ usuario: null, estado: "error", mensajeError: resultado.mensaje ?? null });
                }
                return resultado;
            }).finally(() => { restauracionEnCurso = null; });

            return restauracionEnCurso;
        },

        cerrarSesion: () => {
            if (cierreEnCurso) return cierreEnCurso;

            cierreEnCurso = encolar(async () => {
                set({ cerrandoSesion: true, mensajeError: null });
                try {
                    const resultado = await solicitarCierreSesion();
                    if (resultado.ok) {
                        set({ usuario: null, estado: "no-autenticado", mensajeError: null });
                    } else {
                        // Conserva el usuario para poder reintentar el cierre.
                        set({ mensajeError: resultado.mensaje ?? null });
                    }
                    return resultado;
                } finally {
                    set({ cerrandoSesion: false });
                }
            }).finally(() => { cierreEnCurso = null; });

            return cierreEnCurso;
        },
    };
});
