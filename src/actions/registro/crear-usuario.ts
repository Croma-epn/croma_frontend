"use server";

interface DatosRegistro {
    nombres: string;
    correo: string;
    contrasena: string;
}

interface ResultadoRegistro {
    ok: boolean;
    mensaje?: string;
    estado?: number;
    errores?: Partial<Record<keyof DatosRegistro, string>>;
}

export async function crearUsuario(datos: DatosRegistro): Promise<ResultadoRegistro> {
    // La acción también valida, aunque el formulario ya lo haga.
    if (typeof datos?.nombres !== 'string' || !datos.nombres.trim() || datos.nombres.length > 100) {
        return { ok: false, mensaje: 'Revisa tu nombre completo.' };
    }
    if (typeof datos.correo !== 'string' || datos.correo.trim().length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo.trim())) {
        return { ok: false, mensaje: 'Ingresa un correo válido.' };
    }
    if (typeof datos.contrasena !== 'string' || datos.contrasena.length < 6) {
        return { ok: false, mensaje: 'Usa al menos 6 caracteres.' };
    }

    const urlBase = process.env.NEXT_PUBLIC_API_URL;

    if (!urlBase) {
        return { ok: false, mensaje: 'No se pudo conectar con el servicio de registro.' };
    }

    try {
        const respuesta = await fetch(`${urlBase.replace(/\/$/, '')}/usuarios/registro/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
                nombre: datos.nombres.trim(),
                correo: datos.correo.trim().toLowerCase(),
                contrasena: datos.contrasena,
            }),
            cache: 'no-store',
            signal: AbortSignal.timeout(15000),
        });

        const datosRespuesta: unknown = await respuesta.json().catch(() => null);
        const cuerpo = typeof datosRespuesta === 'object' && datosRespuesta !== null
            ? datosRespuesta as Record<string, unknown>
            : null;
        const mensaje = typeof cuerpo?.mensaje === 'string' && cuerpo.mensaje.trim()
            ? cuerpo.mensaje
            : undefined;

        if (respuesta.ok) {
            return { ok: true, mensaje };
        }

        const errores: ResultadoRegistro['errores'] = {};
        const erroresApi = typeof cuerpo?.errores === 'object' && cuerpo.errores !== null
            ? cuerpo.errores as Record<string, unknown>
            : null;
        const campos = { nombre: 'nombres', correo: 'correo', contrasena: 'contrasena' } as const;
        for (const campo of Object.keys(campos) as (keyof typeof campos)[]) {
            const valor = erroresApi?.[campo];
            const error = Array.isArray(valor)
                ? valor.find((item): item is string => typeof item === 'string' && !!item.trim())
                : valor;
            if (typeof error === 'string' && error.trim()) errores[campos[campo]] = error;
        }
        if (respuesta.status === 409 && !errores.correo) {
            errores.correo = mensaje;
        }

        return { ok: false, estado: respuesta.status, mensaje, errores };
    } catch {
        return { ok: false, mensaje: 'No se pudo conectar con el servidor. Inténtalo de nuevo.' };
    }
}
