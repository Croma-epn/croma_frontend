'use client'

import { BotonFormulario } from "@/components/formulario/boton-formulario/BotonFormulario";
import { CampoContrasena } from "@/components/formulario/campo-contrasena/CampoContrasena";
import { CampoFormulario } from "@/components/formulario/campo-formulario/CampoFormulario";
import { useForm } from "react-hook-form";
import { LuLock, LuMail } from "react-icons/lu";

type FormValues = {
    email: string;
    contrasena: string;
};

export const InicioSesionFormulario = () => {
    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors, isSubmitting } }
        = useForm<FormValues>({
            mode: 'onTouched',
            defaultValues: {
                email: '',
                contrasena: '',
            },
        });

    const onSubmit = () => {
        // La conexión con el backend se implementará en otra tarea.
    };

    return (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7" >
            <CampoFormulario
                id="email" etiqueta="Correo electrónico" icono={LuMail} type="email"
                placeholder="nombre@correo.com" autoComplete="email" maxLength={254}
                {...register('email', {
                    required: 'Ingresa tu correo.',
                    onChange: () => { void trigger('email'); },
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Ingresa un correo válido.' },
                })}
                error={errors.email?.message}
            />

            <CampoContrasena
                id="contrasena" etiqueta="Contraseña" icono={LuLock}
                placeholder="Ingresa tu contraseña" autoComplete="current-password"
                {...register('contrasena', {
                    required: 'Ingresa tu contraseña.',
                })}
                error={errors.contrasena?.message}
            />

            <BotonFormulario disabled={isSubmitting}>
                {isSubmitting ? 'Iniciando sesión…' : 'Iniciar sesión'}
            </BotonFormulario>
        </form>
    );
}