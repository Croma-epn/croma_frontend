import type { RespuestaCierreSesion } from "@/interfaces/autenticacion/autenticacion";
import {
    api,
    finalizarCierreSesion,
    limpiarAccessToken,
    prepararCierreSesion,
} from "@/lib/api";

export type ResultadoCierreSesion =
    | ({ ok: true } & RespuestaCierreSesion)
    | { ok: false; mensaje: string; estado?: number };

let cierreEnCurso: Promise<ResultadoCierreSesion> | null = null;

async function solicitarCierreSesion(): Promise<ResultadoCierreSesion> {
    try {
        await prepararCierreSesion();

        const respuesta = await api("/usuarios/logout/", { method: "POST" });

        if (!respuesta.ok) {
            return {
                ok: false,
                estado: respuesta.status,
                mensaje: "No se pudo cerrar sesión. Inténtalo de nuevo.",
            };
        }

        // El estado HTTP confirma el cierre aunque el cuerpo no sea JSON válido.
        limpiarAccessToken();

        return { ok: true, mensaje: "Sesión cerrada." };
    } catch {
        return {
            ok: false,
            mensaje: "No se pudo conectar con el servidor para cerrar sesión. Inténtalo de nuevo.",
        };
    } finally {
        finalizarCierreSesion();
    }
}

export function cerrarSesion(): Promise<ResultadoCierreSesion> {
    if (!cierreEnCurso) {
        cierreEnCurso = solicitarCierreSesion().finally(() => {
            cierreEnCurso = null;
        });
    }

    return cierreEnCurso;
}
