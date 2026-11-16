import { Smartphone } from "lucide-react";

export const PanelHerramientas = () => {
    return (
        <aside className="h-full w-60 shrink-0 border-r border-borde bg-superficie p-4">
            <h2 className="text-sm font-semibold text-texto">
                Herramientas
            </h2>
            <p className="mt-2 text-[11px] leading-[1.7] text-texto-secundario">
                Clic o arrastrar al lienzo
            </p>
            <button
                type="button"
                className="mt-4 flex w-full items-center gap-3 rounded-lg border border-morado-200 bg-principal-palido p-3 text-[12px] font-bold text-texto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-principal"
            >
                <span className="flex size-8 items-center justify-center rounded-md bg-principal-suave text-principal">
                    <Smartphone aria-hidden="true" className="size-4" />
                </span>
                Pantalla
            </button>
        </aside>
    );
}
