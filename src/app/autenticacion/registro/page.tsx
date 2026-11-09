import { PanelInicio } from "@/components/panel-inicio/PanelInicio";
import { RegistroFormulario } from "@/components/registro/registro-formulario/RegistroFormulario";
import { fuenteTitulo } from "@/config/fuentes";
import Link from "next/link";

export default function RegistroPagina() {
    return (
        <div className="grid min-h-dvh bg-superficie text-texto md:grid-cols-[0.9fr_1.1fr]">
            <PanelInicio />
            <main className="flex flex-col items-center justify-center px-6 py-8 sm:px-10">
                <div className="w-full max-w-97.5">
                    <h1 className={`mb-3 text-titulo leading-tight font-extrabold tracking-tighter ${fuenteTitulo.className}`}>Crea tu cuenta</h1>
                    <RegistroFormulario />
                </div>
                <p className="mt-5 text-center text-etiqueta text-texto-secundario">
                    ¿Ya tienes cuenta?{' '}
                    <Link href="/autenticacion/inicio-sesion"
                        className="font-bold text-principal"
                    >Iniciar sesión</Link>
                </p>
            </main>

        </div>
    );
}