"use server";

type ResultadoSaludo =
    | { success: true; mensaje: string }
    | { success: false; error: string };

export async function enviarNombre(
    nombre: string,
): Promise<ResultadoSaludo> {
    if (typeof nombre !== "string" || !nombre.trim()) {
        return {
            success: false,
            error: "Debes ingresar un nombre.",
        };
    }

    const apiUrl = process.env.API_BASE_URL;

    if (!apiUrl) {
        return {
            success: false,
            error: "Falta configurar la dirección del backend.",
        };
    }

    try {
        const response = await fetch(
            `${apiUrl.replace(/\/+$/, "")}/saludar/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nombre: nombre.trim() }),
                signal: AbortSignal.timeout(10_000),
                cache: "no-store",
            },
        );

        if (!response.ok) {
            return {
                success: false,
                error: "El backend no pudo procesar la solicitud.",
            };
        }

        const data = await response.json();

        if (typeof data?.mensaje !== "string") {
            return {
                success: false,
                error: "El backend devolvió una respuesta inesperada.",
            };
        }

        return {
            success: true,
            mensaje: data.mensaje,
        };
    } catch {
        return {
            success: false,
            error: "No se pudo comunicar con el backend. Intenta nuevamente.",
        };
    }
}