import { InicioSesionFormulario } from "@/components/inicio-sesion/inicio-sesion-formulario/InicioSesionFormulario";
import { PanelInicio } from "@/components/panel-inicio/PanelInicio";
import { fuenteTitulo } from "@/config/fuentes";
import Link from "next/link";

export default function InicioSesionPagina() {
    return (
        <div className="grid min-h-dvh bg-superficie text-texto md:grid-cols-[0.9fr_1.1fr]">
            <PanelInicio />
            <main className="flex flex-col items-center justify-center px-6 py-8 sm:px-10">
                <div className="w-full max-w-97.5">
                    <h1 className={`mb-3 text-titulo leading-tight font-extrabold tracking-tighter ${fuenteTitulo.className}`}>Continúa tu trabajo</h1>
                    <InicioSesionFormulario />
                </div>
                <p className="mt-5 text-center text-etiqueta text-texto-secundario">
                    ¿Todavía no tienes cuenta?{' '}
                    <Link href="/autenticacion/registro"
                        className="font-bold text-principal"
                    >Crear cuenta</Link>
                </p>
            </main>

        </div>

    )
}
