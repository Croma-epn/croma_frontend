"use client";

import { useState, type FormEvent } from "react";
import { registrarUsuario } from "@/actions/autenticacion/registrarUsuario";
import { CampoFormulario } from "@/components/formularios/campo-formulario";
import type { ResultadoRegistro } from "@/interfaces/autenticacion/registro";

export function FormularioRegistro() {
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoRegistro | null>(null);

  async function enviarRegistro(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (enviando) return;
    const formulario = evento.currentTarget;
    const datos = new FormData(formulario);
    if (datos.get("contrasena") !== datos.get("confirmacion")) {
      setResultado({ success: false, error: "Las contraseñas deben coincidir." });
      return;
    }
    setEnviando(true);
    setResultado(null);

    try {
      const respuesta = await registrarUsuario({
        nombre: String(datos.get("nombre") ?? ""),
        correo: String(datos.get("correo") ?? ""),
        contrasena: String(datos.get("contrasena") ?? ""),
      });
      setResultado(respuesta);
      if (respuesta.success) {
        formulario.reset();
      }
    } catch {
      setResultado({ success: false, error: "No se pudo enviar el registro. Intenta nuevamente." });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="registro-tarjeta" aria-labelledby="titulo-registro">
      <h1 id="titulo-registro">Crea tu cuenta</h1>
      <form onSubmit={enviarRegistro} aria-busy={enviando}>
        <fieldset disabled={enviando}>
          <CampoFormulario id="nombre" name="nombre" etiqueta="Nombre completo" autoComplete="name" placeholder="Ej. Ana Pérez" maxLength={100} required />
          <CampoFormulario id="correo" name="correo" etiqueta="Correo electrónico" type="email" autoComplete="email" placeholder="nombre@correo.com" maxLength={254} required />
          <CampoFormulario id="contrasena" name="contrasena" etiqueta="Contraseña" type="password" autoComplete="new-password" placeholder="Crea una contraseña" maxLength={128} required />
          <CampoFormulario id="confirmacion" name="confirmacion" etiqueta="Confirmar contraseña" type="password" autoComplete="new-password" placeholder="Repite tu contraseña" maxLength={128} required />
          <button className="registro-boton" type="submit">{enviando ? "Creando cuenta…" : "Crear cuenta"}</button>
        </fieldset>
      </form>
      {resultado && (
        <p className={resultado.success ? "registro-exito" : "registro-error"} role={resultado.success ? "status" : "alert"}>
          {resultado.success ? resultado.mensaje : resultado.error}
        </p>
      )}
    </section>
  );
}

