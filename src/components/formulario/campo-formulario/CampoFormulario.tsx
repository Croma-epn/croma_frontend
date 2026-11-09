import type { IconType } from "react-icons";

export interface CampoFormularioProps extends React.InputHTMLAttributes<HTMLInputElement> {
    etiqueta: string;
    icono: IconType;
    error?: string;
    accion?: React.ReactNode;
}

export const CampoFormulario = ({ etiqueta, icono: Icono, id, error, accion, ...propiedades }: CampoFormularioProps) => {
    return (
        <div>
            <label htmlFor={id} className="mb-2 flex items-center gap-1.5 text-etiqueta font-bold text-neutro-700">
                <Icono aria-hidden="true" className="h-4 w-4 shrink-0 text-principal" />{etiqueta}
            </label>
            <div className="relative">
                <input {...propiedades} id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}
                    className={`campo h-12 ${accion ? 'pr-12' : ''}`} />
                {accion}
            </div>
            {error && <p id={`${id}-error`} className="mt-1.5 text-etiqueta text-error">{error}</p>}
        </div>
    );
}