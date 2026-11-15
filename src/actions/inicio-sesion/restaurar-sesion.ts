import type { Usuario } from "@/interfaces/usuario/usuario";
import { api, ErrorRespuestaApi, limpiarAccessToken, renovarSesion } from "@/lib/api";

export type ResultadoRestauracionSesion =
    | { ok: true; usuario: Usuario }
    | { ok: false; motivo: "sin-sesion" | "error"; mensaje?: string };

let restauracionEnCurso: Promise<ResultadoRestauracionSesion> | null = null;

function esUsuario(valor: unknown): valor is Usuario {
    return (
        typeof valor === "object" &&
        valor !== null &&
        "id" in valor && typeof valor.id === "number" &&
        "nombre" in valor && typeof valor.nombre === "string" &&
        "correo" in valor && typeof valor.correo === "string"
    );
}

async function solicitarRestauracion(): Promise<ResultadoRestauracionSesion> {
    try {
        if (!(await renovarSesion())) {
            return {
                ok: false,
                motivo: "sin-sesion",
            };
        }

        const respuesta = await api("/usuarios/yo/", { cache: "no-store" });
        const datos: unknown = await respuesta.json().catch(() => null);
        const mensaje = typeof datos === "object" && datos !== null
            && "mensaje" in datos && typeof datos.mensaje === "string"
            ? datos.mensaje
            : undefined;

        if (respuesta.status === 401) {
            limpiarAccessToken();
            return {
                ok: false,
                motivo: "sin-sesion",
                mensaje,
            };
        }

        if (!respuesta.ok) {
            return {
                ok: false,
                motivo: "error",
                mensaje,
            };
        }

        const usuario = datos;

        if (!esUsuario(usuario)) {
            return {
                ok: false,
                motivo: "error",
                mensaje: "La API devolvió datos de usuario inválidos.",
            };
        }

        return { ok: true, usuario };
    } catch (error) {
        return {
            ok: false,
            motivo: "error",
            mensaje: error instanceof ErrorRespuestaApi
                ? error.mensaje
                : "No se pudo comprobar tu sesión. Inténtalo de nuevo.",
        };
    }
}

// Comparte el flujo completo, incluida la consulta del perfil.
export function restaurarSesion(): Promise<ResultadoRestauracionSesion> {
    if (!restauracionEnCurso) {
        restauracionEnCurso = solicitarRestauracion().finally(() => {
            restauracionEnCurso = null;
        });
    }

    return restauracionEnCurso;
}
