"use client";

import {
    Background,
    BackgroundVariant,
    ReactFlow,
    useNodesInitialized,
    useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Grid2X2, Smartphone } from "lucide-react";

import type {
    NodeProps,
    OnNodesChange,
    ReactFlowInstance,
} from "@xyflow/react";
import type { NodoPantalla } from "@/interfaces/modelador/elementos/pantalla";
import type { DragEvent, RefObject } from "react";
import { Pantalla } from "@/components/modelador/elementos/Pantalla";
import { useEffect, useRef } from "react";
import { CentradoLienzo } from "../centrado-lienzo/CentradoLienzo";


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
    onAgregarPantalla: (posicion: NodoPantalla["position"]) => void;
    onActualizarPantallas: OnNodesChange<NodoPantalla>;
}

export const Lienzo = ({
    pantallas,
    onAgregarPantalla,
    onActualizarPantallas,
}: LienzoProps) => {

    const instanciaReactFlow =
        useRef<ReactFlowInstance<NodoPantalla> | null>(null);

    const permitirSoltar = (evento: DragEvent<HTMLDivElement>) => {
        if (
            !evento.dataTransfer.types.includes(
                "application/x-croma-elemento",
            )
        ) {
            return;
        }

        evento.preventDefault();
        evento.dataTransfer.dropEffect = "copy";
    };

    const soltarElemento = (evento: DragEvent<HTMLDivElement>) => {
        evento.preventDefault();

        const tipo = evento.dataTransfer.getData(
            "application/x-croma-elemento",
        );

        if (tipo !== "pantalla" || !instanciaReactFlow.current) {
            return;
        }

        const posicion = instanciaReactFlow.current.screenToFlowPosition({
            x: evento.clientX,
            y: evento.clientY,
        });

        onAgregarPantalla(posicion);
    };

    const contenedorLienzo = useRef<HTMLDivElement | null>(null);
    const nuevoElementoId = pantallas[pantallas.length - 1]?.id;

    return (
        <div
            className="relative h-full w-full bg-fondo"
            onDragOver={permitirSoltar}
            onDrop={soltarElemento}
            ref={contenedorLienzo}
        >
            <ReactFlow<NodoPantalla>
                nodeOrigin={[0.5, 0.5]}
                onInit={(instancia) => {
                    instanciaReactFlow.current = instancia;
                }}
                onNodesChange={onActualizarPantallas}
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

                <CentradoLienzo
                    nuevoElementoId={nuevoElementoId}
                    contenedor={contenedorLienzo}
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
            )}

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
