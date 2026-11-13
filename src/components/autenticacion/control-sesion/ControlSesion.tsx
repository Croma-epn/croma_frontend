"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { useAutenticacionStore } from "@/store/autenticacion/autenticacion.store";

export const ControlSesion = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const estado = useAutenticacionStore((sesion) => sesion.estado);
    const usuario = useAutenticacionStore((sesion) => sesion.usuario);
    const mensajeError = useAutenticacionStore((sesion) => sesion.mensajeError);
    const restaurarSesion = useAutenticacionStore((sesion) => sesion.restaurarSesion);
    const errorNotificado = useRef<string | null>(null);

    useEffect(() => {
        if (estado === "sin-comprobar") {
            void restaurarSesion();
        }

        if (estado === "no-autenticado") {
            router.replace("/autenticacion/inicio-sesion");
        }
    }, [estado, restaurarSesion, router]);

    useEffect(() => {
        if (estado !== "error") {
            errorNotificado.current = null;
            return;
        }

        if (mensajeError && mensajeError !== errorNotificado.current) {
            errorNotificado.current = mensajeError;
            toast.add({ title: mensajeError, type: "error" });
        }
    }, [estado, mensajeError]);

    if (estado === "autenticado" && usuario) {
        return <>{children}</>;
    }

    if (estado === "error") {
        return (
            <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-fondo px-6 text-center text-texto">
                <p>No pudimos comprobar tu sesión.</p>
                <button
                    type="button"
                    className="boton boton-primario"
                    onClick={() => { void restaurarSesion(); }}
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div
            role="status"
            aria-live="polite"
            className="min-h-dvh bg-fondo"
        >
            <span className="sr-only">
                {estado === "no-autenticado" ? "Redirigiendo al inicio de sesión…" : "Cargando…"}
            </span>
        </div>
    );
};
