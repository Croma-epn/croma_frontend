import Image from "next/image";

export function PanelPresentacion() {
  return <aside className="registro-panel">
    <div className="registro-marca"><span className="simbolo-marca"><Image src="/logo.webp" alt="Croma" width={39} height={39} priority /></span><div><strong>Croma</strong><small>Modelador de interacción</small></div></div>
    <div className="registro-presentacion">
      <h2><span>Diseña el flujo, no solo</span><br />las pantallas.</h2>
      <span className="registro-lema">Modela. Conecta. Valida.</span>
      <p>Arrastra pantallas al lienzo, conéctalas con flechas y define la navegación completa de tu producto. Croma convierte tu modelo en un prototipo navegable — sin escribir una sola línea de código.</p>
    </div>
  </aside>;
}


