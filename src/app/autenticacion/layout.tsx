
import { PanelPresentacion } from "@/components/autenticacion/panel-presentacion";
import "./autenticacion.css";

export default function AutenticacionLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="registro-estructura">
            <PanelPresentacion />
            <main className="registro-contenido">{children}</main>
        </div>
    );
}
