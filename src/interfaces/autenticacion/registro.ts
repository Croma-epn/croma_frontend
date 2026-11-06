export interface DatosRegistro {
  nombre: string;
  correo: string;
  contrasena: string;
}

export type ResultadoRegistro =
  | { success: true; mensaje: string }
  | { success: false; error: string };
