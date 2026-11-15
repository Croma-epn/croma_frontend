"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { useRef, useState } from "react";
import { DialogoCierreSesion } from "@/components/inicio-sesion/confirmacion-cierre-sesion/DialogoCierreSesion";
import { LuLogOut } from "react-icons/lu";
import { useAutenticacionStore } from "@/store/autenticacion/autenticacion.store";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EncabezadoProps {
    onSolicitarCierreSesion?: () => void;
}

export const Encabezado = ({ onSolicitarCierreSesion }: EncabezadoProps) => {
    const usuario = useAutenticacionStore((sesion) => sesion.usuario);
    const cerrarSesion = useAutenticacionStore((sesion) => sesion.cerrarSesion);
    const cerrandoSesion = useAutenticacionStore((sesion) => sesion.cerrandoSesion);
    const router = useRouter();
    const [confirmacionAbierta, setConfirmacionAbierta] = useState(false);
    const [procesandoCierre, setProcesandoCierre] = useState(false);
    const cierreSolicitado = useRef(false);

    const confirmarCierreSesion = async () => {
        if (cierreSolicitado.current) return;
        cierreSolicitado.current = true;
        setProcesandoCierre(true);

        try {
            const resultado = await cerrarSesion();
            if (!resultado.ok) {
                toast.add({ title: resultado.mensaje, type: "error" });
                return;
            }

            setConfirmacionAbierta(false);
            router.replace("/autenticacion/inicio-sesion");
            toast.add({ title: resultado.mensaje, type: "success" });
        } catch {
            toast.add({ title: "No se pudo cerrar sesión. Inténtalo de nuevo.", type: "error" });
        } finally {
            cierreSolicitado.current = false;
            setProcesandoCierre(false);
        }
    };

    if (!usuario) return null;

    const inicial = Array.from(usuario.nombre.trim())[0]?.toLocaleUpperCase("es") || "?";

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-borde bg-superficie px-6 sm:px-10">
            <Link href="/proyectos" aria-label="Croma, mis proyectos" className="flex items-center gap-2.5 rounded-control focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-principal">
                <Image src="/icon.png" alt="" width={34} height={34} className="size-8 rounded-marca object-contain" />
                <span className="text-destacado font-bold tracking-tight text-texto">Croma</span>
            </Link>

            <DropdownMenu>
                <DropdownMenuTrigger
                    aria-label={`Abrir menú de ${usuario.nombre}`}
                    className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-morado-200/30 bg-principal-suave text-etiqueta font-bold text-principal outline-none transition-[border-color,box-shadow] hover:border-morado-200 hover:ring-3 hover:ring-principal-suave focus-visible:border-morado-200 focus-visible:ring-3 focus-visible:ring-morado-200"
                >
                    <span aria-hidden="true">{inicial}</span>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    sideOffset={10}
                    className="w-64 max-w-[calc(100vw-2rem)] rounded-tarjeta border border-borde bg-superficie p-3 text-texto shadow-tarjeta ring-0"
                >
                    <DropdownMenuGroup>
                        <DropdownMenuLabel className="flex items-center gap-3 px-1 py-1.5 font-normal">
                            <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-marca bg-principal-suave text-etiqueta font-bold text-principal">
                                {inicial}
                            </span>
                            <span className="min-w-0">
                                <span className="block truncate text-etiqueta font-bold text-texto" title={usuario.nombre}>{usuario.nombre}</span>
                                <span className="mt-0.5 block truncate text-nota text-texto-secundario" title={usuario.correo}>{usuario.correo}</span>
                            </span>
                        </DropdownMenuLabel>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="my-2 bg-borde" />

                    <DropdownMenuItem
                        onClick={() => {
                            setConfirmacionAbierta(true);
                            onSolicitarCierreSesion?.();
                        }}
                        className="min-h-9 cursor-pointer gap-3 rounded-control px-2 text-etiqueta font-semibold text-error focus:bg-error-suave focus:text-error not-data-[variant=destructive]:focus:**:text-error"
                    >
                        <LuLogOut aria-hidden="true" className="size-4" />
                        Cerrar sesión
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DialogoCierreSesion
                abierto={confirmacionAbierta}
                onAbiertoChange={setConfirmacionAbierta}
                onConfirmar={confirmarCierreSesion}
                cerrando={procesandoCierre || cerrandoSesion}
            />
        </header>
    );
};
