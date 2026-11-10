export const BotonFormulario = ({ children, disabled = false }: { children: React.ReactNode; disabled?: boolean }) => (
    <button type="submit" disabled={disabled} className="boton boton-primario min-h-11 w-full text-cuerpo">
        {children}
    </button>
);
