"use server";

interface DatosRegistro {
    nombres: string;
    email: string;
    contrasena: string;
}

interface ResultadoRegistro {
    ok: boolean;
    mensaje: string;
    errores?: Partial<Record<keyof DatosRegistro, string>>;
}

export async function crearUsuario(datos: DatosRegistro): Promise<ResultadoRegistro> {
    // La acción también valida, aunque el formulario ya lo haga.
    if (typeof datos?.nombres !== 'string' || !datos.nombres.trim() || datos.nombres.length > 100) {
        return { ok: false, mensaje: 'Revisa tu nombre completo.' };
    }
    if (typeof datos.email !== 'string' || datos.email.trim().length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email.trim())) {
        return { ok: false, mensaje: 'Ingresa un correo válido.' };
    }
    if (typeof datos.contrasena !== 'string' || datos.contrasena.length < 6 || datos.contrasena.length > 128) {
        return { ok: false, mensaje: 'La contraseña debe tener entre 6 y 128 caracteres.' };
    }

    const urlBase = process.env.API_BASE_URL;

    if (!urlBase) {
        return { ok: false, mensaje: 'No se pudo conectar con el servicio de registro.' };
    }

    try {
        const respuesta = await fetch(`${urlBase.replace(/\/$/, '')}/v1/usuarios/registro/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
                nombre: datos.nombres.trim(),
                correo: datos.email.trim(),
                contrasena: datos.contrasena,
            }),
            cache: 'no-store',
            signal: AbortSignal.timeout(15000),
        });

        if (respuesta.status === 201) {
            return { ok: true, mensaje: 'Cuenta creada correctamente.' };
        }
        if (respuesta.status === 409) {
            return { ok: false, mensaje: 'Este correo ya tiene una cuenta.', errores: { email: 'Este correo ya tiene una cuenta.' } };
        }
        if (respuesta.status === 400 || respuesta.status === 422) {
            // El esquema no documenta el cuerpo de error: solo leemos los campos conocidos.
            const cuerpo = await respuesta.json().catch(() => null);
            const errores: ResultadoRegistro['errores'] = {};
            const campos = { nombre: 'nombres', correo: 'email', contrasena: 'contrasena' } as const;
            for (const campo of Object.keys(campos) as (keyof typeof campos)[]) {
                const valor = cuerpo?.[campo];
                const mensaje = Array.isArray(valor) ? valor[0] : valor;
                if (typeof mensaje === 'string') errores[campos[campo]] = mensaje;
            }
            return { ok: false, mensaje: 'No se pudo crear la cuenta. Revisa los datos ingresados.', errores };
        }
        return { ok: false, mensaje: 'No se pudo crear la cuenta. Inténtalo más tarde.' };
    } catch {
        return { ok: false, mensaje: 'No se pudo conectar con el servidor. Inténtalo de nuevo.' };
    }
}
