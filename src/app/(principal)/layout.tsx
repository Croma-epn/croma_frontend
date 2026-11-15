import { ControlSesion } from "@/components/autenticacion/control-sesion/ControlSesion";
import { Encabezado } from "@/components/ui/Encabezado";

export default function PrincipalLayout({ children }: { children: React.ReactNode }) {
    return <ControlSesion>
        <Encabezado />
        {children}
    </ControlSesion>;
}
