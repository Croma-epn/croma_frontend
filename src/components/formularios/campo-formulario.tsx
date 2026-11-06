import type { InputHTMLAttributes } from "react";

type PropiedadesCampo = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  etiqueta: string;
};

export function CampoFormulario({ id, etiqueta, ...propiedades }: PropiedadesCampo) {
  return (
    <div className="registro-campo">
      <label htmlFor={id}>{etiqueta}</label>
      <input id={id} {...propiedades} />
    </div>
  );
}
