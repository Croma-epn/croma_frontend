import type { Node } from "@xyflow/react";

// Definición de tipo para un nodo de pantalla en el modelador
// Usamos type y no interface para mantener la consistencia con la definición de Node de React Flow
export type NodoPantalla = Node<
    {
        codigo: string;
        nombre: string;
        // Al utilizar Node de React Flow, también incorporamos su estructura: 
        // id, type, position y selected, entre otras propiedades.
    },
    "pantalla" // Tipo de nodo para una pantalla
>;