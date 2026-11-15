'use client'

import { BotonFormulario } from "@/components/formulario/boton-formulario/BotonFormulario";
import { CampoContrasena } from "@/components/formulario/campo-contrasena/CampoContrasena";
import { CampoFormulario } from "@/components/formulario/campo-formulario/CampoFormulario";
import { toast } from "@/components/ui/toast";
import type { CredencialesInicioSesion } from "@/interfaces/autenticacion/autenticacion";
import { useAutenticacionStore } from "@/store/autenticacion/autenticacion.store";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { LuLock, LuMail } from "react-icons/lu";

export const InicioSesionFormulario = () => {
    const router = useRouter();
    const iniciarSesion = useAutenticacionStore((estado) => estado.iniciarSesion);
    const iniciandoSesion = useAutenticacionStore((estado) => estado.iniciandoSesion);
    const {
        register,
        handleSubmit,
        trigger,
        setError,
        formState: { errors, isSubmitting } }
        = useForm<CredencialesInicioSesion>({
            mode: 'onTouched',
            defaultValues: {
                correo: '',
                contrasena: '',
            },
        });

    const onSubmit = async (datos: CredencialesInicioSesion) => {
        try {
            const resultado = await iniciarSesion(datos);

            if (resultado.ok) {
                router.replace('/proyectos');
                if (resultado.mensaje) {
                    toast.add({ title: resultado.mensaje, type: 'success' });
                }
                return;
            }

            for (const campo of ['correo', 'contrasena'] as const) {
                const mensaje = resultado.errores[campo]?.[0];
                if (mensaje) setError(campo, { type: 'server', message: mensaje });
            }

            if (resultado.mensaje) {
                toast.add({ title: resultado.mensaje, type: 'error' });
            }
        } catch {
            toast.add({
                title: 'No se pudo iniciar sesión. Inténtalo de nuevo.',
                type: 'error',
            });
        }
    };

    const enviando = isSubmitting || iniciandoSesion;

    return (
        <form noValidate onSubmit={handleSubmit(onSubmit)} aria-busy={enviando} className="flex flex-col gap-7" >
            <CampoFormulario
                id="correo" etiqueta="Correo electrónico" icono={LuMail} type="email"
                placeholder="nombre@correo.com" autoComplete="email" maxLength={254}
                {...register('correo', {
                    required: 'Ingresa tu correo.',
                    onChange: () => { void trigger('correo'); },
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Ingresa un correo válido.' },
                })}
                error={errors.correo?.message}
            />

            <CampoContrasena
                id="contrasena" etiqueta="Contraseña" icono={LuLock}
                placeholder="Ingresa tu contraseña" autoComplete="current-password"
                {...register('contrasena', {
                    required: 'Ingresa tu contraseña.',
                })}
                error={errors.contrasena?.message}
            />

            <BotonFormulario disabled={enviando}>
                {enviando ? 'Iniciando sesión…' : 'Iniciar sesión'}
            </BotonFormulario>
        </form>
    );
}
