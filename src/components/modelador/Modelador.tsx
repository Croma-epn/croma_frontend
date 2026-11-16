"use client";

import type { NodoPantalla } from "@/interfaces/modelador/elementos/pantalla";
import { Lienzo } from "./lienzo/Lienzo";
import { PanelHerramientas } from "./panel-herramientas/PanelHerramientas";
import { useState } from "react";

export const Modelador = () => {

    const [pantallas, setPantallas] = useState<NodoPantalla[]>([]);

    const agregarPantalla = () => {
        setPantallas((actuales) => {
            const numero = actuales.length + 1;

            const nuevaPantalla: NodoPantalla = {
                id: `pantalla-${numero}`,
                type: "pantalla",
                position: {
                    x: 80 + ((numero - 1) % 3) * 290,
                    y: 80 + Math.floor((numero - 1) / 3) * 120,
                },
                data: {
                    codigo: `VC-${String(numero).padStart(2, "0")}`,
                    nombre: `Nueva pantalla ${numero}`,
                },
                selected: true,
            };

            return [
                ...actuales.map((pantalla) => ({
                    ...pantalla,
                    selected: false,
                })),
                nuevaPantalla,
            ];
        });
    };

    return (
        <main className="flex h-[calc(100dvh-4rem)] overflow-hidden">
            <PanelHerramientas onAgregarPantalla={agregarPantalla} />

            <section
                aria-label="Lienzo de modelado"
                className="min-w-0 flex-1"
            >
                <Lienzo pantallas={pantallas} />
            </section>
        </main>
    );
};