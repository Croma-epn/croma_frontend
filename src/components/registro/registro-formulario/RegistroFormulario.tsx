"use client";

import { LuUser, LuMail, LuCheck, LuLock } from "react-icons/lu";
import { CampoFormulario } from "@/components/formulario/campo-formulario/CampoFormulario";
import { BotonFormulario } from "@/components/formulario/boton-formulario/BotonFormulario";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { CampoContrasena } from "@/components/formulario/campo-contrasena/CampoContrasena";
import { crearUsuario } from "@/actions/registro/crear-usuario";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { useAutenticacionStore } from "@/store/autenticacion/autenticacion.store";

type FormValues = {
    nombres: string;
    correo: string;
    contrasena: string;
    confirmarContrasena: string;
};

export const RegistroFormulario = () => {
    const router = useRouter();
    const establecerCorreoRegistro = useAutenticacionStore((estado) => estado.establecerCorreoRegistro);
    const {
        register,
        handleSubmit,
        getValues,
        trigger,
        setValue,
        control,
        setError,
        formState: { errors, touchedFields, isSubmitted, isSubmitting } }
        = useForm<FormValues>({
            mode: 'onTouched',
            defaultValues: {
                nombres: '',
                correo: '',
                contrasena: '',
                confirmarContrasena: ''
            },
        });

    const nombres = useWatch({
        control,
        name: 'nombres'
    });

    const onSubmit: SubmitHandler<FormValues> = async (datos) => {
        try {
            const resultado = await crearUsuario({
                nombres: datos.nombres,
                correo: datos.correo,
                contrasena: datos.contrasena,
            });
            if (resultado.ok) {
                if (resultado.mensaje) {
                    toast.add({ title: resultado.mensaje, type: 'success' });
                }
                establecerCorreoRegistro(datos.correo.trim().toLowerCase());
                router.replace('/autenticacion/inicio-sesion');
                return;
            }
            if (resultado.estado === 409) {
                setError('correo', { message: resultado.errores?.correo ?? resultado.mensaje });
                return;
            }
            if (resultado.errores) {
                const errores = resultado.errores;
                if (errores?.nombres) setError('nombres', { message: errores.nombres });
                if (errores?.correo) setError('correo', { message: errores.correo });
                if (errores?.contrasena) setError('contrasena', { message: errores.contrasena });
            }
            if (resultado.mensaje) {
                toast.add({ title: resultado.mensaje, type: 'error' });
            }
        } catch {
            toast.add({ title: 'No se pudo completar la solicitud. Inténtalo de nuevo.', type: 'error' });
        }
    };

    return (
        <form noValidate onSubmit={handleSubmit(onSubmit)} aria-busy={isSubmitting} className="flex flex-col gap-7">
            <CampoFormulario
                id="nombres" etiqueta="Nombre completo" icono={LuUser}
                placeholder="Ej. Ana Pérez" autoComplete="name" maxLength={100}
                {...register('nombres', {
                    validate: value => !!value.trim() || 'Escribe tu nombre completo.',
                })}
                error={errors.nombres?.message}
                aviso={
                    nombres.length === 100
                        ? 'Alcanzaste el máximo de 100 caracteres.'
                        : undefined
                }
            />
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
                placeholder="Crea una contraseña" autoComplete="new-password"
                {...register('contrasena', {
                    required: 'Ingresa tu contraseña.',
                    minLength: { value: 6, message: 'Usa al menos 6 caracteres.' },
                    onChange: () => {
                        void trigger(touchedFields.confirmarContrasena || isSubmitted
                            ? ['contrasena', 'confirmarContrasena']
                            : 'contrasena');
                    },
                    deps: ['confirmarContrasena'],
                })}
                error={errors.contrasena?.message}
            />
            <CampoContrasena
                id="confirmarContrasena" etiqueta="Confirmar contraseña" icono={LuCheck}
                placeholder="Repite tu contraseña" autoComplete="new-password"
                {...register('confirmarContrasena', {
                    required: 'Las contraseñas deben coincidir.',
                    validate: value => value === getValues('contrasena') || 'Las contraseñas deben coincidir.',
                    onChange: (evento) => {
                        setValue('confirmarContrasena', evento.target.value, {
                            shouldTouch: true,
                            shouldValidate: true,
                        });
                    },
                })}
                error={
                    touchedFields.confirmarContrasena || isSubmitted
                        ? errors.confirmarContrasena?.message
                        : undefined
                }
            />
            <BotonFormulario disabled={isSubmitting}>
                {isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}
            </BotonFormulario>
        </form>
    );
};
