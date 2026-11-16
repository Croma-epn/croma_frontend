"use client";

import { Smartphone } from "lucide-react";

interface PanelHerramientasProps {
    onAgregarPantalla: () => void;
}

export const PanelHerramientas = ({
    onAgregarPantalla,
}: PanelHerramientasProps) => {
    return (
        <aside className="h-full w-60 shrink-0 border-r border-borde bg-superficie p-4">
            <h2 className="text-sm font-semibold text-texto">
                Herramientas
            </h2>
            <p className="mt-2 text-nota leading-[1.7] text-texto-secundario">
                Clic o arrastrar al lienzo
            </p>
            <button
                type="button"
                className="mt-4 flex w-full cursor-pointer items-center gap-3 rounded-lg border border-[#ded9e9] bg-[#f9f7fc] p-3 text-etiqueta font-bold text-texto transition-[border-color,background-color,transform] duration-150 hover:-translate-y-px hover:border-[#9781c9] hover:bg-principal-palido focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-principal"
                onClick={onAgregarPantalla}
            >
                <span className="flex size-8 items-center justify-center rounded-md bg-principal-suave text-principal">
                    <Smartphone aria-hidden="true" className="size-4" />
                </span>
                Pantalla
            </button>
        </aside>
    );
}
