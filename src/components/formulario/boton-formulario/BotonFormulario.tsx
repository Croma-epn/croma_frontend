export const BotonFormulario = ({ children }: { children: React.ReactNode }) => (
    <button type="submit" className="boton boton-primario min-h-11 w-full text-cuerpo">
        {children}
    </button>
);
