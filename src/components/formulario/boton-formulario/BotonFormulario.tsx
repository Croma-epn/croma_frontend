import type { ComponentPropsWithRef } from "react";

interface BotonFormularioProps extends ComponentPropsWithRef<"button"> {
    anchoCompleto?: boolean;
    compacto?: boolean;
}

export const BotonFormulario = ({ children, anchoCompleto = true, compacto = false, className, type = "submit", ...propiedades }: BotonFormularioProps) => (
    <button {...propiedades} type={type} className={`boton boton-primario ${compacto ? 'min-h-9 py-2 leading-tight' : 'min-h-11'} ${anchoCompleto ? 'w-full' : 'w-auto'} text-cuerpo ${className ?? ''}`}>
        {children}
    </button>
);
