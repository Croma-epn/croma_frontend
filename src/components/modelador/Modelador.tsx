"use client";

import type { NodoPantalla } from "@/interfaces/modelador/elementos/pantalla";
import type { OnNodesChange } from "@xyflow/react";
import { Lienzo } from "./lienzo/Lienzo";
import { PanelHerramientas } from "./panel-herramientas/PanelHerramientas";
import { useState } from "react";

export const Modelador = () => {

    const actualizarPantallas: OnNodesChange<NodoPantalla> = (cambios) => {
        setPantallas((actuales) => cambios.applyTo(actuales));
    };

    const [pantallas, setPantallas] = useState<NodoPantalla[]>([]);

    const agregarPantalla = (posicion?: NodoPantalla["position"]) => {
        setPantallas((actuales) => {
            const numero = actuales.length + 1; // Determina el número de la nueva pantalla basado en la cantidad actual

            const nuevaPantalla: NodoPantalla = {
                id: `pantalla-${numero}`,
                type: "pantalla",
                // Posición inicial de la nueva pantalla en el lienzo
                position: posicion ?? {
                    x: 80 + ((numero - 1) % 3) * 290,
                    y: 80 + Math.floor((numero - 1) / 3) * 120,
                },
                data: {
                    codigo: `VC-${String(numero).padStart(2, "0")}`, // Código de la pantalla con formato VC-01, VC-02, etc
                    nombre: `Nueva pantalla ${numero}`, // Nombre de la pantalla
                },
                selected: true, // Marcar la nueva pantalla como seleccionada
            };

            return [
                ...actuales.map((pantalla) => ({
                    ...pantalla,
                    selected: false, // Las pantallas existentes se deseleccionan al agregar una nueva
                })),
                nuevaPantalla,
            ];
        });
    };

    return (
        <main className="flex h-[calc(100dvh-4rem)] overflow-hidden">
            <PanelHerramientas onAgregarPantalla={() => agregarPantalla()} />

            <section
                aria-label="Lienzo de modelado"
                className="min-w-0 flex-1"
            >
                <Lienzo
                    pantallas={pantallas}
                    onAgregarPantalla={agregarPantalla}
                    onActualizarPantallas={actualizarPantallas}
                />
            </section>
        </main>
    );
};