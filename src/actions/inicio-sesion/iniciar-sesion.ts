import type {
    CredencialesInicioSesion,
    RespuestaErrorApi,
    RespuestaInicioSesion,
} from "@/interfaces/autenticacion/autenticacion";
import { api, establecerAccessToken } from "@/lib/api";

export type ResultadoInicioSesion =
    | ({ ok: true } & Omit<RespuestaInicioSesion, "access">)
    | ({ ok: false; estado?: number } & RespuestaErrorApi);

function esObjeto(valor: unknown): valor is Record<string, unknown> {
    return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

function esRespuestaInicioSesion(valor: unknown): valor is RespuestaInicioSesion {
    if (!esObjeto(valor) || !esObjeto(valor.usuario)) return false;

    return (
        typeof valor.mensaje === "string" &&
        typeof valor.access === "string" &&
        valor.access.length > 0 &&
        typeof valor.usuario.id === "number" &&
        typeof valor.usuario.nombre === "string" &&
        typeof valor.usuario.correo === "string"
    );
}

export async function iniciarSesion(
    credenciales: CredencialesInicioSesion,
): Promise<ResultadoInicioSesion> {
    let respuesta: Response;

    try {
        respuesta = await api("/usuarios/login/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                correo: credenciales.correo.trim().toLowerCase(),
                contrasena: credenciales.contrasena,
            }),
        });
    } catch {
        return {
            ok: false,
            mensaje: "No se pudo conectar con el servidor. Inténtalo de nuevo.",
            errores: {},
        };
    }

    const datos: unknown = await respuesta.json().catch(() => null);

    if (!respuesta.ok) {
        const errores: RespuestaErrorApi["errores"] = {};

        if (esObjeto(datos) && esObjeto(datos.errores)) {
            for (const [campo, mensajes] of Object.entries(datos.errores)) {
                if (Array.isArray(mensajes)) {
                    errores[campo] = mensajes.filter(
                        (mensaje): mensaje is string => typeof mensaje === "string",
                    );
                }
            }
        }

        return {
            ok: false,
            estado: respuesta.status,
            mensaje: esObjeto(datos) && typeof datos.mensaje === "string"
                ? datos.mensaje
                : respuesta.status === 401
                    ? "No encontramos una cuenta con esos datos. Revisa tus credenciales o crea una cuenta."
                    : "No se pudo iniciar sesión. Inténtalo de nuevo.",
            errores,
        };
    }

    if (!esRespuestaInicioSesion(datos)) {
        return {
            ok: false,
            estado: respuesta.status,
            mensaje: "La API devolvió una respuesta de inicio de sesión inválida.",
            errores: {},
        };
    }

    establecerAccessToken(datos.access);

    return {
        ok: true,
        mensaje: datos.mensaje,
        usuario: datos.usuario,
    };
}
