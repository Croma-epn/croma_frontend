import type { Node } from "@xyflow/react";

export type NodoPantalla = Node<
    {
        codigo: string;
        nombre: string;
    },
    "pantalla" // Tipo de nodo para una pantalla
>;