import { ControlSesion } from "@/components/autenticacion/control-sesion/ControlSesion";

export default function PrincipalLayout({ children }: { children: React.ReactNode }) {
    return <ControlSesion>{children}</ControlSesion>;
}
