import { Lienzo } from "@/components/modelador/lienzo/Lienzo";
import { PanelHerramientas } from "@/components/modelador/panel-herramientas/PanelHerramientas";

export default function ProyectoPagina() {
    return (
        <main className="flex h-[calc(100dvh-4rem)] overflow-hidden">
            <PanelHerramientas />

            <section
                aria-label="Lienzo de modelado"
                className="min-w-0 flex-1"
            >
                <Lienzo />
            </section>
        </main>
    );
}