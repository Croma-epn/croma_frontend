import type { ComponentPropsWithRef } from "react";
import type { IconType } from "react-icons";
import { LuInfo } from "react-icons/lu";

interface CampoFormularioBaseProps {
    etiqueta: string;
    icono: IconType;
    error?: string;
    aviso?: string;
    accion?: React.ReactNode;
    /** Cantidad actual de caracteres; maxLength proporciona el límite mostrado. */
    contador?: number;
}

export type CampoFormularioInputProps = CampoFormularioBaseProps & ComponentPropsWithRef<"input"> & {
    multilinea?: false;
};

type CampoFormularioTextareaProps = CampoFormularioBaseProps & ComponentPropsWithRef<"textarea"> & {
    multilinea: true;
};

export type CampoFormularioProps = CampoFormularioInputProps | CampoFormularioTextareaProps;

export const CampoFormulario = ({ etiqueta, icono: Icono, id, error, aviso, accion, contador, ...propiedades }: CampoFormularioProps) => {
    const mensaje = error || aviso;
    const descripcion = [
        propiedades["aria-describedby"],
        mensaje && id ? `${id}-mensaje` : undefined,
        contador !== undefined && id ? `${id}-contador` : undefined,
    ].filter(Boolean).join(" ") || undefined;

    const renderizarControl = () => {
        if (propiedades.multilinea) {
            const { multilinea, className, rows = 4, ...atributos } = propiedades;
            void multilinea;
            return <textarea {...atributos} id={id} rows={rows} aria-invalid={!!error} aria-describedby={descripcion}
                className={`campo min-h-24 resize-y ${accion ? 'pr-12' : ''} ${className ?? ''}`} />;
        }

        const { multilinea, className, ...atributos } = propiedades;
        void multilinea;
        return <input {...atributos} id={id} aria-invalid={!!error} aria-describedby={descripcion}
            className={`campo h-12 ${accion ? 'pr-12' : ''} ${className ?? ''}`} />;
    };

    return (
        <div className="relative">
            <label htmlFor={id} className="mb-2 flex items-center gap-1.5 text-etiqueta font-bold text-neutro-700">
                <Icono aria-hidden="true" className="h-4 w-4 shrink-0 text-principal" />{etiqueta}
                {propiedades.required && <span aria-hidden="true" className="text-error">*</span>}
            </label>
            <div className="relative">
                {renderizarControl()}
                {accion}
            </div>
            <div className={contador !== undefined ? "relative mt-1.5" : "absolute top-full right-0 left-0 mt-1.5"}>
                {contador !== undefined && (
                    <p id={id ? `${id}-contador` : undefined} className="text-nota text-texto-secundario">
                        {contador}{propiedades.maxLength !== undefined ? `/${propiedades.maxLength}` : ''} caracteres
                    </p>
                )}
                {mensaje && (
                    <p id={id ? `${id}-mensaje` : undefined} role="status" className={`flex items-start gap-1 text-nota leading-4 ${contador !== undefined ? 'absolute top-full right-0 left-0 mt-1.5' : ''} ${error ? 'text-error' : 'font-semibold text-advertencia-texto'}`}>
                        {mensaje && !error && <LuInfo aria-hidden="true" className="mt-0.5 size-3 shrink-0" />}
                        <span>{mensaje}</span>
                    </p>
                )}
            </div>
        </div>
    );
};
