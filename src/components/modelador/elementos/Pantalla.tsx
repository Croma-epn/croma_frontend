import { Smartphone } from "lucide-react";

interface PantallaProps {
    codigo: string;
    nombre: string;
    seleccionada?: boolean;
}

export const Pantalla = ({ codigo, nombre, seleccionada = false }: PantallaProps) => {
    return (
        <div
            className={`min-h-20 w-65 overflow-hidden rounded-marca border bg-superficie ${seleccionada
                ? "border-principal ring-2 ring-principal/15 shadow-sm"
                : "border-borde shadow-[0_7px_20px_#281d400c]"
                }`}
        >
            <div className="flex h-9.25 items-center gap-1.75 border-b border-borde bg-[#f5f4f8] pl-3 pr-1.5">
                <Smartphone aria-hidden="true" className="size-4 shrink-0 text-principal" />
                <p className="min-w-0 flex-1 truncate text-[12.5px] font-bold text-texto" title={nombre}>
                    {nombre}
                </p>
                <p className="shrink-0 whitespace-nowrap text-[10.5px] font-medium text-texto-secundario">
                    {codigo}
                </p>
            </div>

            <div className="h-10.25" />
        </div>
    );
};
