"use client";

import { useRef, type RefObject } from "react";
import { LuInfo } from "react-icons/lu";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";

interface DialogoCierreSesionProps {
    abierto: boolean;
    onAbiertoChange: (abierto: boolean) => void;
    onConfirmar?: () => void;
    volverFocoA?: RefObject<HTMLButtonElement | null>;
}

export const DialogoCierreSesion = ({
    abierto,
    onAbiertoChange,
    onConfirmar,
    volverFocoA,
}: DialogoCierreSesionProps) => {
    const botonCancelar = useRef<HTMLButtonElement>(null);

    return (
        <Dialog open={abierto} onOpenChange={onAbiertoChange}>
            <DialogContent
                showCloseButton={false}
                initialFocus={botonCancelar}
                finalFocus={volverFocoA}
                className="gap-6 rounded-modal bg-superficie px-6 py-7 text-center text-texto shadow-modal ring-1 ring-borde sm:max-w-127.5"
            >
                <span aria-hidden="true" className="mx-auto flex size-10 items-center justify-center rounded-marca bg-error-suave text-error">
                    <LuInfo className="size-5" />
                </span>
                <div className="space-y-2">
                    <DialogTitle className="font-titulo text-seccion font-bold text-texto">¿Cerrar sesión?</DialogTitle>
                    <DialogDescription className="text-etiqueta text-texto-secundario">
                        Tus proyectos se mantienen guardados.
                    </DialogDescription>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                    <DialogClose render={<button type="button" ref={botonCancelar} className="boton boton-secundario py-1.5 text-cuerpo hover:bg-fondo" />}>
                        Seguir aquí
                    </DialogClose>
                    <button type="button" onClick={onConfirmar} className="boton boton-peligro py-1.5 text-cuerpo hover:bg-error-suave">
                        Cerrar sesión
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
