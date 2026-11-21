"use client";

import { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { CampoFormulario, type CampoFormularioInputProps } from "../campo-formulario/CampoFormulario";

export const CampoContrasena = (propiedades: Omit<CampoFormularioInputProps, 'type' | 'accion' | 'multilinea'>) => {
    const [visible, setVisible] = useState(false);
    const IconoVisibilidad = visible ? LuEye : LuEyeOff;
    return (
        <CampoFormulario {...propiedades} type={visible ? 'text' : 'password'} accion={
            <button type="button" onClick={() => setVisible(!visible)}
                aria-label={`${visible ? 'Ocultar' : 'Mostrar'} ${propiedades.etiqueta.toLowerCase()}`} aria-pressed={visible}
                className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-control text-texto-secundario transition-colors hover:bg-principal-suave hover:text-principal focus-visible:bg-principal-suave focus-visible:text-principal focus-visible:outline-2 focus-visible:outline-principal">
                <IconoVisibilidad aria-hidden="true" className="h-4 w-4 shrink-0" />
            </button>
        } />
    );
};
