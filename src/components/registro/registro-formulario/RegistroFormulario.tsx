"use client";

import { useState } from "react";
import { LuUser, LuMail, LuCheck, LuLock } from "react-icons/lu";
import { CampoFormulario } from "@/components/formulario/campo-formulario/CampoFormulario";
import { BotonFormulario } from "@/components/formulario/boton-formulario/BotonFormulario";
import { SubmitHandler, useForm } from "react-hook-form";
import { CampoContrasena } from "@/components/formulario/campo-contrasena/CampoContrasena";

type FormValues = {
    nombres: string;
    email: string;
    contrasena: string;
    confirmarContrasena: string;
};

export const RegistroFormulario = () => {
    const [mensaje, setMensaje] = useState('');
    const { register, handleSubmit, getValues, formState: { errors } } = useForm<FormValues>({
        defaultValues: { nombres: '', email: '', contrasena: '', confirmarContrasena: '' },
    });

    const onSubmit: SubmitHandler<FormValues> = () => {
        // Aquí se conectará el registro con el backend.
        setMensaje('Los datos son válidos. El registro aún no está conectado al servidor.');
    };

    return (
        <form noValidate onSubmit={handleSubmit(onSubmit)} onChange={() => setMensaje('')} className="flex flex-col gap-7">
            <CampoFormulario
                id="nombres" etiqueta="Nombre completo" icono={LuUser}
                placeholder="Ej. Ana Pérez" autoComplete="name" maxLength={100}
                {...register('nombres', { validate: value => !!value.trim() || 'Escribe tu nombre completo.' })}
                error={errors.nombres?.message}
            />
            <CampoFormulario
                id="email" etiqueta="Correo electrónico" icono={LuMail} type="email"
                placeholder="nombre@correo.com" autoComplete="email"
                {...register('email', {
                    required: 'Escribe tu correo electrónico.',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Escribe un correo válido.' },
                })}
                error={errors.email?.message}
            />

            <CampoContrasena
                id="contrasena" etiqueta="Contraseña" icono={LuLock}
                placeholder="Crea una contraseña" autoComplete="new-password"
                {...register('contrasena', {
                    required: 'Escribe una contraseña.',
                    minLength: { value: 6, message: 'Usa al menos 6 caracteres.' },
                    deps: ['confirmarContrasena'],
                })}
                error={errors.contrasena?.message}
            />
            <CampoContrasena
                id="confirmarContrasena" etiqueta="Confirmar contraseña" icono={LuCheck}
                placeholder="Repite tu contraseña" autoComplete="new-password"
                {...register('confirmarContrasena', {
                    required: 'Confirma tu contraseña.',
                    validate: value => value === getValues('contrasena') || 'Las contraseñas deben coincidir.',
                })}
                error={errors.confirmarContrasena?.message}
            />

            <BotonFormulario>Crear cuenta</BotonFormulario>
            {mensaje && <p role="status" className="text-cuerpo text-principal">{mensaje}</p>}
        </form>
    );
};
