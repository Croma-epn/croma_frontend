"use client";

import Link from "next/link";
import { LuAlignLeft, LuArrowRight, LuFolder, LuImage, LuPlus } from "react-icons/lu";
import { CampoFormulario } from "@/components/formulario/campo-formulario/CampoFormulario";
import { BotonFormulario } from "@/components/formulario/boton-formulario/BotonFormulario";
import { fuenteTitulo } from "@/config/fuentes";

export const ProyectoFormulario = () => {
    return (
        <main className="flex flex-1 justify-center px-4 py-5 sm:px-6 sm:py-6">
            <section aria-labelledby="crear-proyecto-titulo" className="w-full max-w-[680px]">
                <h1 id="crear-proyecto-titulo" className={`mb-4 flex items-center justify-center gap-2.5 text-[clamp(25px,2.3vw,31px)] leading-[1.2] font-extrabold tracking-[-0.05em] text-texto ${fuenteTitulo.className}`}>
                    <LuPlus aria-hidden="true" className="size-5.5 shrink-0 text-principal" />
                    Crear proyecto
                </h1>

                <form noValidate onSubmit={(evento) => evento.preventDefault()} className="rounded-tarjeta border border-borde bg-superficie p-5 shadow-tarjeta sm:p-6">
                    <div className="flex flex-col gap-5">
                        <CampoFormulario
                            id="nombre-proyecto"
                            name="nombre"
                            etiqueta="Nombre del proyecto"
                            icono={LuFolder}
                            placeholder="Ej. Sistema de tutorías"
                            required
                        />

                        <CampoFormulario
                            id="descripcion-proyecto"
                            name="descripcion"
                            etiqueta="Descripción"
                            icono={LuAlignLeft}
                            placeholder="¿Para qué sirve la aplicación y a quién está dirigida?"
                            multilinea
                            rows={3}
                        />

                        <div>
                            <label htmlFor="portada-proyecto" className="mb-2 flex items-center gap-1.5 text-etiqueta font-bold text-neutro-700">
                                <LuImage aria-hidden="true" className="size-4 shrink-0 text-principal" />
                                Imagen de portada <span className="text-texto-secundario">(opcional)</span>
                            </label>
                            <div className="flex flex-wrap items-center gap-3.5">
                                <div role="img" aria-label="Sin imagen de portada" className="flex h-18 w-[118px] shrink-0 items-center justify-center overflow-hidden rounded-control border border-dashed border-borde bg-principal-palido">
                                    <LuImage aria-hidden="true" className="size-6 text-morado-300" />
                                </div>
                                <div>
                                    <input id="portada-proyecto" name="portada" type="file" accept="image/*" aria-describedby="portada-ayuda" className="peer sr-only" />
                                    <label htmlFor="portada-proyecto" className="boton boton-secundario h-9 py-0 text-etiqueta peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-principal">
                                        Subir imagen
                                    </label>
                                    <p id="portada-ayuda" className="mt-2 text-nota text-texto-secundario">Máximo 4 MB</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-wrap justify-end gap-[9px] border-t border-borde pt-4">
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
