"use client";

import { enviarNombre } from "@/actions/saludo/enviarNombre";
import Image from "next/image";
import { FormEvent, useState } from "react";

export default function Home() {
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (cargando) return;

    setMensaje("");
    setError("");
    setCargando(true);

    try {
      const resultado = await enviarNombre(nombre);

      if (resultado.success) {
        setMensaje(resultado.mensaje);
      } else {
        setError(resultado.error);
      }
    } catch {
      setError("No se pudo enviar la solicitud. Intenta nuevamente.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-2xl font-bold">
        Prueba de concepto
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block font-bold">
            Ingresa tu nombre:
          </label>

          <input
            id="nombre"
            name="nombre"
            type="text"
            placeholder="Nombre"
            autoComplete="given-name"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            disabled={cargando}
            required
            className="rounded border px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={cargando || !nombre.trim()}
          className="rounded border px-4 py-2 disabled:opacity-50"
        >
          {cargando ? "Enviando..." : "Enviar"}
        </button>
      </form>

      <p role="status">{mensaje}</p>

      {error && (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
