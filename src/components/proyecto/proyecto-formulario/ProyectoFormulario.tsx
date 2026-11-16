"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useForm, useWatch } from "react-hook-form";
import { LuAlignLeft, LuArrowRight, LuFolder, LuImage, LuInfo, LuPlus } from "react-icons/lu";
import { CampoFormulario } from "@/components/formulario/campo-formulario/CampoFormulario";
import { BotonFormulario } from "@/components/formulario/boton-formulario/BotonFormulario";
import { fuenteTitulo } from "@/config/fuentes";
import { useProyectoBorradorStore } from "@/store/proyecto/proyecto-borrador.store";

interface ProyectoFormularioDatos {
    nombre: string;
    descripcion: string;
}

export const ProyectoFormulario = () => {

    const borrador = useProyectoBorradorStore((estado) => estado.borrador);
    const actualizarBorrador = useProyectoBorradorStore(
        (estado) => estado.actualizarBorrador
    );

    const { register, handleSubmit, control, formState: { errors } } = useForm<ProyectoFormularioDatos>({
        mode: "all",
        defaultValues: { nombre: borrador.nombre, descripcion: borrador.descripcion },
    });
    const [nombre, descripcion] = useWatch({ control, name: ["nombre", "descripcion"] });
    const [portada, setPortada] = useState<{ archivo: File; url: string } | null>(null);
    const [avisoPortada, setAvisoPortada] = useState("");
    const selectorPortada = useRef<HTMLInputElement>(null);
    const seleccionActual = useRef(0);

    useEffect(() => () => { seleccionActual.current += 1; }, []);

    useEffect(() => {
        if (!portada) return;
        return () => URL.revokeObjectURL(portada.url);
    }, [portada]);

    // Carga la portada del borrador al montar el componente, si existe.
    useEffect(() => {
        const archivo = useProyectoBorradorStore.getState().borrador.portada;

        if (!archivo) return;

        const url = URL.createObjectURL(archivo); // Crea un objeto URL para la imagen de portada
        const imagen = new window.Image(); // Crea un objeto de imagen para verificar si se puede cargar correctamente

        imagen.onload = () => {
            setPortada({ archivo, url });
        };

        imagen.src = url; // Asigna la URL al objeto de imagen para iniciar la carga

        return () => {
            imagen.onload = null;
            URL.revokeObjectURL(url);
        };
    }, []);

    const seleccionarPortada = async (evento: ChangeEvent<HTMLInputElement>) => {
        const archivo = evento.target.files?.[0];
        if (!archivo) return;
        // Permite volver a elegir el mismo archivo después de quitarlo o reemplazarlo.
        evento.target.value = "";
        const seleccion = ++seleccionActual.current;
        const advertir = (mensaje: string) => {
            setAvisoPortada(portada ? "Archivo inválido, se mantiene la portada actual." : mensaje);
        };
        const formatos: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };
        const extension = archivo.name.split(".").pop()?.toLowerCase() ?? "";
        const avisoTipo = "El archivo debe ser una imagen. El proyecto se creará sin portada.";

        if (!formatos[extension] || archivo.type !== formatos[extension]) {
            advertir(avisoTipo);
            return;
        }
        if (archivo.size > 4 * 1024 * 1024) {
            advertir("La imagen supera los 4 MB. Usa una más ligera. El proyecto se creará sin portada.");
            return;
        }

        try {
            // Comprueba que el contenido pueda leerse como imagen, incluso si fue renombrado.
            const imagen = await createImageBitmap(archivo);
            imagen.close();
        } catch {
            if (seleccion === seleccionActual.current) advertir(avisoTipo);
            return;
        }
        if (seleccion !== seleccionActual.current) return;

        setPortada({ archivo, url: URL.createObjectURL(archivo) });
        actualizarBorrador({ portada: archivo });
        setAvisoPortada("");
    };

    const quitarPortada = () => {
        seleccionActual.current += 1;
        setPortada(null);
        actualizarBorrador({ portada: null }); // Actualiza el borrador para reflejar que no hay portada
        setAvisoPortada("");

        if (selectorPortada.current) {
            selectorPortada.current.value = "";
        }
    };

    const crearProyecto = () => {
        // La integración de creación se añadirá cuando esté disponible el endpoint.
    };

    return (
        <main className="flex flex-1 justify-center px-4 py-5 sm:px-6 sm:py-6">
            <section aria-labelledby="crear-proyecto-titulo" className="w-full max-w-170">
                <h1 id="crear-proyecto-titulo" className={`mb-4 flex items-center justify-center gap-2.5 text-[clamp(25px,2.3vw,31px)] leading-[1.2] font-extrabold tracking-tighter text-texto ${fuenteTitulo.className}`}>
                    <LuPlus aria-hidden="true" className="size-5.5 shrink-0 text-principal" />
                    Crear proyecto
                </h1>

                <form noValidate onSubmit={handleSubmit(crearProyecto)} className="rounded-tarjeta border border-borde bg-superficie p-5 shadow-tarjeta sm:p-6">
                    <div className="flex flex-col gap-7">
                        <div>
                            <CampoFormulario
                                id="nombre-proyecto"
                                {...register("nombre", {
                                    validate: (valor) =>
                                        !!valor.trim() || "El nombre del proyecto es obligatorio.",
                                    onChange: (evento) => {
                                        actualizarBorrador({ nombre: evento.target.value });
                                    },
                                })}
                                etiqueta="Nombre del proyecto"
                                icono={LuFolder}
                                placeholder="Ej. Sistema de tutorías"
                                required
                                maxLength={30}
                                contador={nombre.length}
                                error={errors.nombre?.message}
                                aviso={nombre.length === 30 ? "Alcanzaste el máximo de 30 caracteres." : undefined}
                            />
                        </div>

                        <CampoFormulario
                            id="descripcion-proyecto"
                            {...register("descripcion", {
                                onChange: (evento) => {
                                    actualizarBorrador({ descripcion: evento.target.value });
                                },
                            })}
                            etiqueta="Descripción"
                            icono={LuAlignLeft}
                            placeholder="¿Para qué sirve la aplicación y a quién está dirigida?"
                            multilinea
                            rows={3}
                            maxLength={150}
                            contador={descripcion.length}
                            aviso={descripcion.length === 150 ? "Alcanzaste el máximo de 150 caracteres." : undefined}
                        />

                        <div>
                            <label htmlFor="portada-proyecto" className="mb-2 flex items-center gap-1.5 text-etiqueta font-bold text-neutro-700">
                                <LuImage aria-hidden="true" className="size-4 shrink-0 text-principal" />
                                Imagen de portada <span className="text-texto-secundario">(opcional)</span>
                            </label>
                            <div className="flex flex-wrap items-center gap-3.5">
                                <div className="flex h-18 w-29.5 shrink-0 items-center justify-center overflow-hidden rounded-control border border-dashed border-borde bg-principal-palido">
                                    {portada ? (
                                        <Image src={portada.url} alt={`Vista previa de la portada: ${portada.archivo.name}`} width={118} height={72} unoptimized className="h-full w-full object-cover" />
                                    ) : (
                                        <span role="img" aria-label="Sin imagen de portada">
                                            <LuImage aria-hidden="true" className="size-6 text-morado-300" />
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <input ref={selectorPortada} id="portada-proyecto" name="portada" type="file" accept=".jpg,.png,.webp" onChange={seleccionarPortada} aria-describedby={`portada-ayuda${avisoPortada ? ' portada-advertencia' : ''}`} className="peer sr-only" />
                                    <label htmlFor="portada-proyecto" className="boton boton-secundario h-9 py-0 text-etiqueta peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-principal">
                                        Subir imagen
                                    </label>
                                    <p id="portada-ayuda" className="mt-2 text-nota text-texto-secundario">JPG, PNG o WebP · máx. 4 MB</p>
                                    {portada && (
                                        <button type="button" onClick={quitarPortada} className="mt-1 rounded-sm text-cuerpo font-semibold text-principal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-principal cursor-pointer">
                                            Quitar imagen
                                        </button>
                                    )}
                                </div>
                            </div>
                            {avisoPortada && (
                                <p id="portada-advertencia" role="status" className="mt-2 flex items-start gap-1.5 rounded-control border border-advertencia-500 bg-advertencia-fondo px-3 py-2 text-nota font-semibold leading-4 text-advertencia-texto">
                                    <LuInfo aria-hidden="true" className="mt-0.5 size-3 shrink-0" />
                                    <span>{avisoPortada}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-5 flex flex-wrap justify-end gap-2.25 border-t border-borde pt-4">
                        <Link href="/proyectos" className="boton boton-secundario min-h-9 py-2 text-cuerpo leading-tight">Cancelar</Link>
                        <BotonFormulario anchoCompleto={false} compacto>
                            Crear proyecto
                            <LuArrowRight aria-hidden="true" className="size-4" />
                        </BotonFormulario>
                    </div>
                </form>
            </section>
        </main>
    );
};
