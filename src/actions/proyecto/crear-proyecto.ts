import type {
    DatosCrearProyecto,
    RespuestaCrearProyecto,
} from "@/interfaces/proyecto/proyecto";
import type { RespuestaErrorApi } from "@/interfaces/autenticacion/autenticacion";
import { api } from "@/lib/api";

export type ResultadoCrearProyecto =
    | ({ ok: true } & RespuestaCrearProyecto)
    | ({ ok: false; estado?: number } & RespuestaErrorApi);

function esObjeto(valor: unknown): valor is Record<string, unknown> {
    return typeof valor === "object"
        && valor !== null
        && !Array.isArray(valor);
}

export async function crearProyecto(
    datos: DatosCrearProyecto,
): Promise<ResultadoCrearProyecto> {
    const formulario = new FormData();

    formulario.append("nombre", datos.nombre.trim());

    if (datos.descripcion?.trim()) {
        formulario.append("descripcion", datos.descripcion.trim());
    }

    if (datos.portada) {
        formulario.append("portada", datos.portada);
    }

    let respuesta: Response;

    try {
        respuesta = await api("/proyectos/", {
            method: "POST",
            body: formulario,
        });
    } catch {
        return {
            ok: false,
            mensaje: "No se pudo conectar con el servidor. Inténtalo de nuevo.",
            errores: {},
        };
    }

    const cuerpo: unknown = await respuesta.json().catch(() => null);

    if (!respuesta.ok) {
        const errores: RespuestaErrorApi["errores"] = {};

        if (esObjeto(cuerpo) && esObjeto(cuerpo.errores)) {
            for (const [campo, mensajes] of Object.entries(cuerpo.errores)) {
                if (Array.isArray(mensajes)) {
                    errores[campo] = mensajes.filter(
                        (mensaje): mensaje is string =>
                            typeof mensaje === "string",
                    );
                }
            }
        }

        return {
            ok: false,
            estado: respuesta.status,
            mensaje: esObjeto(cuerpo) && typeof cuerpo.mensaje === "string"
                ? cuerpo.mensaje
                : "No se pudo crear el proyecto. Inténtalo de nuevo.",
            errores,
        };
    }

    if (
        !esObjeto(cuerpo)
        || typeof cuerpo.mensaje !== "string"
        || !esObjeto(cuerpo.proyecto)
        || typeof cuerpo.proyecto.id !== "number"
        || !Number.isSafeInteger(cuerpo.proyecto.id)
        || cuerpo.proyecto.id <= 0
    ) {
        return {
            ok: false,
            estado: respuesta.status,
            mensaje: "El servidor respondió, pero no se pudo identificar el proyecto creado. Revisa Mis proyectos antes de reintentar.",
            errores: {},
        };
    }

    return {
        ok: true,
        mensaje: cuerpo.mensaje,
        proyecto: {
            id: cuerpo.proyecto.id,
        },
    };
}