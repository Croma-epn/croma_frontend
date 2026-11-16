import Link from 'next/link';

export default function ProyectosPagina() {
    return (
        <>
            <div className='ml-15 mt-10 text-3xl font-bold'>
                <h1>Mis proyectos</h1>
            </div>
            <div className='boton boton-primario m-15'>
                <Link href="/proyecto">Crear nuevo proyecto</Link>
            </div>
        </>
    );
}
