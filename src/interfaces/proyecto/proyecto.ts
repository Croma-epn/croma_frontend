export interface DatosCrearProyecto {
    nombre: string;
    descripcion?: string;
    portada?: File;
}

export interface RespuestaCrearProyecto {
    mensaje: string;
    proyecto: {
        id: number;
    };
}