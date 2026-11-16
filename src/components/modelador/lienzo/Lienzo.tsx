"use client";

import { Background, BackgroundVariant, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Grid2X2, Smartphone } from "lucide-react";

import type { NodeProps } from "@xyflow/react";
import type { NodoPantalla } from "@/interfaces/modelador/elementos/pantalla";
import { Pantalla } from "@/components/modelador/elementos/Pantalla";

// PantallaNodo recibe la selección de React Flow y la pasa al componente visual
const PantallaNodo = ({ data, selected }: NodeProps<NodoPantalla>) => {
    return (
        <Pantalla
            codigo={data.codigo}
            nombre={data.nombre}
            seleccionada={selected}
        />
    );
};

const tiposDeNodo = {
    pantalla: PantallaNodo,
};

interface LienzoProps {
    pantallas: NodoPantalla[];
}

export const Lienzo = ({ pantallas }: LienzoProps) => {
    return (
        <div className="relative h-full w-full bg-fondo">
            <ReactFlow
                style={{ colorScheme: "light" }}
                nodes={pantallas}
                nodeTypes={tiposDeNodo}
                nodesFocusable={false}
                deleteKeyCode={null}
                edges={[]}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
                panOnDrag={false}
                panOnScroll={false}
                zoomOnScroll={false}
                zoomOnPinch={false}
                zoomOnDoubleClick={false}
                panActivationKeyCode={null}
                zoomActivationKeyCode={null}
            >
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={22}
                    size={2}
                    color="var(--color-neutro-200)"
                    bgColor="var(--color-fondo)"
                />
            </ReactFlow>

            {pantallas.length === 0 && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
                    <div className="w-full max-w-85 text-center">
                        <div className="mx-auto mb-3.5 flex size-14 items-center justify-center rounded-2xl bg-principal-suave text-principal">
                            <Smartphone aria-hidden="true" className="size-6" />
                        </div>
                        <h1 className="font-titulo text-[17px] font-extrabold leading-normal text-texto">
                            Tu modelo empieza aquí
                        </h1>
                        <p className="mt-1.75 text-nota leading-[1.7] text-texto-secundario">
                            Haz clic o arrastra «Pantalla» desde «Herramientas» para colocar la primera pantalla.
                        </p>
                    </div>
                </div>
            )};

            <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-2 rounded-md bg-fondo/90 px-2 py-1 text-micro text-texto-secundario">
                <Grid2X2 aria-hidden="true" className="size-4" />
                {/* Contador de elementos en el lienzo */}
                <span>
                    Lienzo de modelado · {pantallas.length}{" "}
                    {pantallas.length === 1 ? "elemento" : "elementos"}
                </span>
            </div>
        </div>
    );
};
