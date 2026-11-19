"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { useNodesInitialized, useReactFlow } from "@xyflow/react";

interface CentradoLienzoProps {
    nuevoElementoId?: string;
    contenedor: RefObject<HTMLDivElement | null>;
}

export const CentradoLienzo = ({
    nuevoElementoId,
    contenedor,
}: CentradoLienzoProps) => {
    const nodosInicializados = useNodesInitialized();

    const {
        getInternalNode,
        getNodesBounds,
        getViewport,
        setCenter,
    } = useReactFlow();

    const ultimoElementoRevisado = useRef<string | null>(null);

    useEffect(() => {
        if (
            !nodosInicializados ||
            !nuevoElementoId ||
            nuevoElementoId === ultimoElementoRevisado.current ||
            !contenedor.current
        ) {
            return;
        }

        const nodo = getInternalNode(nuevoElementoId);

        if (!nodo?.measured.width || !nodo.measured.height) {
            return;
        }

        const limites = getNodesBounds([nuevoElementoId]);
        const vista = getViewport();

        const izquierda = limites.x * vista.zoom + vista.x;
        const arriba = limites.y * vista.zoom + vista.y;
        const derecha = izquierda + limites.width * vista.zoom;
        const abajo = arriba + limites.height * vista.zoom;

        const fueraDeVista =
            izquierda < 0 ||
            arriba < 0 ||
            derecha > contenedor.current.clientWidth ||
            abajo > contenedor.current.clientHeight;

        ultimoElementoRevisado.current = nuevoElementoId;

        if (fueraDeVista) {
            void setCenter(
                limites.x + limites.width / 2,
                limites.y + limites.height / 2,
                {
                    zoom: vista.zoom,
                    duration: 0,
                },
            );
        }
    }, [
        nodosInicializados,
        nuevoElementoId,
        contenedor,
        getInternalNode,
        getNodesBounds,
        getViewport,
        setCenter,
    ]);

    return null;
};