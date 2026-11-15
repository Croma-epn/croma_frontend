const URL_API = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

export class ErrorRespuestaApi extends Error {
    constructor(public readonly mensaje?: string) {
        super(mensaje);
    }
}

let accessToken: string | null = null;
let renovacionEnCurso: Promise<boolean> | null = null;
let cierreEnCurso = false;
let versionSesion = 0;

const RUTAS_SIN_RENOVACION = new Set([
    "/usuarios/login/",
    "/usuarios/token/refresh/",
    "/usuarios/logout/",
    "/usuarios/registro/",
]);

export function establecerAccessToken(token: string): void {
    accessToken = token;
}

export function limpiarAccessToken(): void {
    accessToken = null;
    versionSesion++;
}

// Espera la rotación de cookie pendiente antes de invalidarla en el backend.
export async function prepararCierreSesion(): Promise<void> {
    cierreEnCurso = true;
    await renovacionEnCurso?.catch(() => false);
}

export function finalizarCierreSesion(): void {
    cierreEnCurso = false;
}

function obtenerUrlApi(): string {
    if (!URL_API) {
        throw new Error("Falta configurar NEXT_PUBLIC_API_URL.");
    }

    return URL_API;
}

async function solicitarRenovacion(): Promise<boolean> {
    const respuesta = await fetch(
        `${obtenerUrlApi()}/usuarios/token/refresh/`,
        {
            method: "POST",
            credentials: "include",
            headers: { Accept: "application/json" },
        },
    );

    if (respuesta.status === 401) {
        limpiarAccessToken();
        return false;
    }

    if (!respuesta.ok) {
        const datos: unknown = await respuesta.json().catch(() => null);
        const mensaje = typeof datos === "object" && datos !== null
            && "mensaje" in datos && typeof datos.mensaje === "string"
            ? datos.mensaje
            : undefined;
        throw new ErrorRespuestaApi(mensaje);
    }

    const datos: unknown = await respuesta.json();

    if (
        typeof datos !== "object" ||
        datos === null ||
        !("access" in datos) ||
        typeof datos.access !== "string" ||
        !datos.access
    ) {
        throw new Error("La API no devolvió un token de acceso válido.");
    }

    establecerAccessToken(datos.access);
    return true;
}

// Las peticiones de esta pestaña esperan la misma renovación.
export function renovarSesion(): Promise<boolean> {
    if (cierreEnCurso) return Promise.resolve(false);

    if (!renovacionEnCurso) {
        renovacionEnCurso = solicitarRenovacion().finally(() => {
            renovacionEnCurso = null;
        });
    }

    return renovacionEnCurso;
}

export async function api(
    ruta: string,
    opciones: RequestInit = {},
): Promise<Response> {
    const enviarPeticion = (token: string | null): Promise<Response> => {
        const cabeceras = new Headers(opciones.headers);
        cabeceras.set("Accept", "application/json");

        if (token) {
            cabeceras.set("Authorization", `Bearer ${token}`);
        } else {
            cabeceras.delete("Authorization");
        }

        return fetch(`${obtenerUrlApi()}${ruta}`, {
            ...opciones,
            headers: cabeceras,
            credentials: "include",
        });
    };

    const versionUtilizada = versionSesion;
    const tokenUtilizado = accessToken;
    const respuesta = await enviarPeticion(tokenUtilizado);

    if (
        respuesta.status !== 401 ||
        RUTAS_SIN_RENOVACION.has(ruta) ||
        cierreEnCurso ||
        versionUtilizada !== versionSesion
    ) {
        return respuesta;
    }

    // Otra petición pudo renovar antes de que llegara este 401.
    if (accessToken && accessToken !== tokenUtilizado) {
        return enviarPeticion(accessToken);
    }

    if (!(await renovarSesion())) {
        return respuesta;
    }

    // Se usa fetch directamente: este reintento no inicia otra renovación.
    return enviarPeticion(accessToken);
}
