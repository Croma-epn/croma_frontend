"use server";

import type { DatosRegistro, ResultadoRegistro } from "@/interfaces/autenticacion/registro";

export async function registrarUsuario(datos: DatosRegistro): Promise<ResultadoRegistro> {
  const nombre = typeof datos.nombre === "string" ? datos.nombre.trim() : "";
  const correo = typeof datos.correo === "string" ? datos.correo.trim() : "";
  const contrasena = typeof datos.contrasena === "string" ? datos.contrasena : "";

  if (!nombre || !correo || !contrasena) {
    return { success: false, error: "Completa todos los campos." };
  }

  const apiUrl = process.env.API_BASE_URL;

  if (!apiUrl) {
    return { success: false, error: "La URL de la API no está configurada." };
  }

  try {
    const response = await fetch(`${apiUrl.replace(/\/+$/, "")}/v1/usuarios/registro/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, correo, contrasena }),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });

    if (response.status === 201) {
      return { success: true, mensaje: "Tu cuenta se creó correctamente." };
    }
    if (response.status === 409) {
      return { success: false, error: "Este correo ya está registrado." };
    }

    const respuesta = await response.json().catch(() => null);
    // Django REST puede responder con un mensaje general o errores por campo.
    const mensajes = ["detail", "mensaje", "error", "nombre", "correo", "contrasena", "non_field_errors"]
      .flatMap(campo => {
        const valor = respuesta?.[campo];
        return typeof valor === "string" ? [valor] : Array.isArray(valor)
          ? valor.filter((item: unknown): item is string => typeof item === "string") : [];
      });

    return {
      success: false,
      error: response.status === 400 && mensajes.length
        ? mensajes.join(" ")
        : "No se pudo crear la cuenta. Intenta nuevamente.",
    };
  } catch {
    return { success: false, error: "No se pudo conectar con el servidor. Intenta nuevamente." };
  }
}
