"use server";

interface DatosRegistro {
    nombres: string;
    correo: string;
    contrasena: string;
}

interface ResultadoRegistro {
    ok: boolean;
    mensaje: string;
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

        if (respuesta.status === 201) {
            return { ok: true, estado: 201, mensaje: 'Cuenta creada correctamente.' };
        }
        if (respuesta.status === 409) {
            return { ok: false, estado: 409, mensaje: 'Este correo ya tiene una cuenta.', errores: { correo: 'Este correo ya tiene una cuenta.' } };
        }
        if (respuesta.status === 400) {
            const cuerpo = await respuesta.json().catch(() => null);
            const errores: ResultadoRegistro['errores'] = {};
            const campos = { nombre: 'nombres', correo: 'correo', contrasena: 'contrasena' } as const;
            for (const campo of Object.keys(campos) as (keyof typeof campos)[]) {
                const valor = cuerpo?.errores?.[campo];
                const mensaje = Array.isArray(valor) ? valor[0] : valor;
                if (typeof mensaje === 'string') errores[campos[campo]] = mensaje;
            }
            return { ok: false, estado: 400, mensaje: 'Revisa los datos ingresados.', errores };
        }
        return { ok: false, mensaje: 'No se pudo crear la cuenta. Inténtalo más tarde.' };
    } catch {
        return { ok: false, mensaje: 'No se pudo conectar con el servidor. Inténtalo de nuevo.' };
    }
}
