import type { IconType } from "react-icons";
import { LuInfo } from "react-icons/lu";

export interface CampoFormularioProps extends React.InputHTMLAttributes<HTMLInputElement> {
    etiqueta: string;
    icono: IconType;
    error?: string;
    aviso?: string;
    accion?: React.ReactNode;
}

export const CampoFormulario = ({ etiqueta, icono: Icono, id, error, aviso, accion, ...propiedades }: CampoFormularioProps) => {
    return (
        <div className="relative">
            <label htmlFor={id} className="mb-2 flex items-center gap-1.5 text-etiqueta font-bold text-neutro-700">
                <Icono aria-hidden="true" className="h-4 w-4 shrink-0 text-principal" />{etiqueta}
            </label>
            <div className="relative">
                <input {...propiedades} id={id} aria-invalid={!!error} aria-describedby={error || aviso ? `${id}-mensaje` : undefined}
                    className={`campo h-12 ${accion ? 'pr-12' : ''}`} />
                {accion}
            </div>
            <div className="absolute top-full right-0 left-0 mt-1.5">
                {(error || aviso) && (
                    <p id={`${id}-mensaje`} role="status" className={`flex items-start gap-1 text-nota leading-4 ${error ? 'text-error' : 'font-semibold text-advertencia-texto'}`}>
                        {!error && <LuInfo aria-hidden="true" className="mt-0.5 size-3 shrink-0" />}
                        <span>{error || aviso}</span>
                    </p>
                )}
            </div>
        </div>
    );
}