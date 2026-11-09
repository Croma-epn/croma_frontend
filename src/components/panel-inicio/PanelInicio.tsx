import { fuenteTitulo } from "@/config/fuentes";
import Image from "next/image";

export const PanelInicio = () => {
    return (
        <aside className="relative isolate overflow-hidden bg-morado-900 px-7 py-8 text-superficie sm:px-12 md:min-h-dvh md:px-[5vw] md:py-11">
            <div aria-hidden="true" className="pointer-events-none absolute -right-[250px] -bottom-[130px] -z-10 size-[530px] rounded-full border border-superficie/10 shadow-halo-grande" />
            <div aria-hidden="true" className="pointer-events-none absolute top-[22%] right-[12%] -z-10 size-60 rounded-full border border-superficie/10 shadow-halo-pequeno" />
            <div className="flex items-center gap-3">
                <span aria-hidden="true" className="grid size-[39px] place-items-center rounded-marca bg-superficie text-2xl">
                    <Image src="/icon.png" alt="" width={39} height={39} className="size-[39px] rounded-marca object-contain" />
                </span>
                <div>
                    <p className={`text-[17px] font-bold tracking-tight ${fuenteTitulo.className}`}>Croma</p>
                    <p className="text-nota text-panel-subtitulo">Modelador de interacción</p>
                </div>
            </div>
            <div className="mx-auto mt-10 max-w-[470px] text-center md:mt-11">
                <h2 className={`text-4xl leading-[1.08] font-extrabold tracking-[-0.06em] lg:text-[46px] ${fuenteTitulo.className}`}>
                    Diseña el flujo, no solo las pantallas.
                </h2>
                <svg viewBox="0 0 360 236" fill="none" aria-hidden="true" className="mx-auto my-6 hidden w-full max-w-[320px] md:block">
                    {/* La pantalla se arrastra y después aparece la conexión. */}
                    <path d="M176 154C196 154 198 90 216 90" pathLength="1" stroke="var(--color-morado-300)" strokeWidth="2.5" strokeDasharray="1" strokeDashoffset="1">
                        <animate attributeName="stroke-dashoffset" values="1;1;0;0;1" keyTimes="0;0.4;0.6;0.9;1" dur="6s" repeatCount="indefinite" />
                    </path>
                    <g transform="translate(64 116)">
                        <animateTransform attributeName="transform" type="translate" values="28 142;28 142;64 116;64 116;28 142" keyTimes="0;0.1;0.35;0.9;1" dur="6s" repeatCount="indefinite" />
                        <rect x="-5" y="-5" width="122" height="86" rx="12" stroke="var(--color-morado-300)" strokeDasharray="6 4">
                            <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1s" repeatCount="indefinite" />
                        </rect>
                        <rect width="112" height="76" rx="10" fill="var(--color-diagrama-fondo)" stroke="var(--color-diagrama-borde)" />
                        <rect x="9" y="10" width="76" height="9" rx="4.5" fill="var(--color-diagrama-cabecera)" />
                        <circle cx="16" cy="14.5" r="2" fill="var(--color-morado-200)" />
                        <path d="M12 31h60M12 42h80M12 53h46" stroke="var(--color-superficie)" strokeOpacity="0.19" strokeWidth="6" strokeLinecap="round" />
                        <rect x="9" y="61" width="34" height="8" rx="4" fill="var(--color-morado-200)" />
                        <circle cx="112" cy="38" r="4.5" fill="var(--color-morado-900)" stroke="var(--color-morado-300)" strokeWidth="2" />
                    </g>
                    <g transform="translate(216 52)">
                        <rect width="112" height="76" rx="10" fill="var(--color-diagrama-fondo)" stroke="var(--color-diagrama-borde)" />
                        <rect x="9" y="10" width="76" height="9" rx="4.5" fill="var(--color-diagrama-cabecera)" />
                        <circle cx="16" cy="14.5" r="2" fill="var(--color-morado-200)" />
                        <path d="M12 31h60M12 42h80M12 53h46" stroke="var(--color-superficie)" strokeOpacity="0.19" strokeWidth="6" strokeLinecap="round" />
                        <rect x="9" y="61" width="34" height="8" rx="4" fill="var(--color-morado-200)" />
                        <circle cy="38" r="4.5" fill="var(--color-morado-900)" stroke="var(--color-morado-300)" strokeWidth="2" />
                    </g>
                    <g transform="translate(78 172)">
                        <animateTransform attributeName="transform" type="translate" values="78 172;78 172;114 146;176 154;216 90;216 90;78 172" keyTimes="0;0.1;0.35;0.4;0.6;0.9;1" dur="6s" repeatCount="indefinite" />
                        <path d="M0 0v17l4.3-3.8 2.6 6.1 3.3-1.4-2.6-6 5.6-.5Z" fill="var(--color-superficie)" stroke="var(--color-morado-800)" strokeWidth="1.4" strokeLinejoin="round" />
                    </g>
                </svg>
                <p className="mt-7 text-micro font-extrabold tracking-[0.13em] text-morado-300 uppercase">Modela. Conecta. Valida.</p>
                <p className="mx-auto mt-5 max-w-[400px] text-[15px] leading-[1.8] text-panel-texto">
                    Arrastra pantallas al lienzo, conéctalas con flechas y define la navegación completa de tu producto. Croma convierte tu modelo en un prototipo navegable — sin escribir una sola línea de código.
                </p>
            </div>
        </aside>
    );
};
