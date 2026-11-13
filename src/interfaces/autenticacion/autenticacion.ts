import { Usuario } from "../usuario/usuario";

export interface CredencialesInicioSesion {
    correo: string;
    contrasena: string;
}

export interface RespuestaInicioSesion {
    mensaje: string;
    usuario: Usuario;
    access: string;
}

export interface RespuestaRenovacionSesion {
    access: string;
}

export interface RespuestaCierreSesion {
    mensaje: string;
}

export interface RespuestaErrorApi {
    mensaje: string;
    errores: Record<string, string[]>;
}