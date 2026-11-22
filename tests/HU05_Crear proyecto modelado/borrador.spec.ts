import { expect, test, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    const correo = process.env.CROMA_TEST_CORREO;
    const contrasena = process.env.CROMA_TEST_CONTRASENA;

    if (!correo || !contrasena) {
        throw new Error('Configura las credenciales de prueba.');
    }

    await page.goto('http://localhost:3000/autenticacion/inicio-sesion');
    await page.getByLabel('Correo electrónico', { exact: true }).fill(correo);
    await page.getByLabel('Contraseña', { exact: true }).fill(contrasena);
    await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();
    await expect(
        page.getByRole('heading', { name: 'Mis proyectos', exact: true }),
    ).toBeVisible();
});

function observarSalida(page: Page) {
    const envios: string[] = [];
    const confirmaciones: string[] = [];

    page.on('request', (solicitud) => {
        if (
            solicitud.method() === 'POST' &&
            new URL(solicitud.url()).pathname === '/proyecto/crear'
        ) {
            envios.push(solicitud.url());
        }
    });

    page.on('dialog', async (dialogo) => {
        confirmaciones.push(dialogo.message());
        await dialogo.dismiss();
    });

    return { envios, confirmaciones };
}

test('CA11a - Salir del formulario con Cancelar sin crear el proyecto', async ({ page }) => {
    // Dado que el estudiante está en «Crear proyecto».
    await page.getByRole('link', { name: 'Crear proyecto', exact: true }).click();
    const { envios, confirmaciones } = observarSalida(page);

    // Cuando pulsa «Cancelar».
    await page.getByRole('link', { name: 'Cancelar', exact: true }).click();

    // Entonces vuelve a «Mis proyectos» sin confirmación ni solicitud de creación.
    await expect(
        page.getByRole('heading', { name: 'Mis proyectos', exact: true }),
    ).toBeVisible();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    expect(confirmaciones).toHaveLength(0);
    expect(envios).toHaveLength(0);
});

test('CA11b - Salir del formulario con el logo Croma sin crear el proyecto', async ({ page }) => {
    // Dado que el estudiante está en «Crear proyecto».
    await page.getByRole('link', { name: 'Crear proyecto', exact: true }).click();
    const { envios, confirmaciones } = observarSalida(page);

    // Cuando pulsa el logo «Croma» de la barra superior.
    await page.getByRole('link', { name: 'Croma, mis proyectos', exact: true }).click();

    // Entonces vuelve a «Mis proyectos» sin confirmación ni solicitud de creación.
    await expect(
        page.getByRole('heading', { name: 'Mis proyectos', exact: true }),
    ).toBeVisible();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    expect(confirmaciones).toHaveLength(0);
    expect(envios).toHaveLength(0);
});

const nombreBorrador = 'Proyecto de prueba';
const descripcionBorrador = 'Descripción del borrador';
const nombrePortada = 'SampleJPGImage_4mb.webp';

async function prepararBorrador(page: Page) {
    await page.getByRole('link', { name: 'Crear proyecto', exact: true }).click();
    await page.getByRole('textbox', { name: 'Nombre del proyecto', exact: true })
        .fill(nombreBorrador);
    await page.getByRole('textbox', { name: 'Descripción', exact: true })
        .fill(descripcionBorrador);

    const selector = page.waitForEvent('filechooser');
    await page.getByText('Subir imagen', { exact: true }).click();
    const archivo = await selector;
    await archivo.setFiles(`public/tests/${nombrePortada}`);
}

test('CA12a - Visualizar información escrita de un proyecto no guardado después de pulsar Cancelar', async ({ page }) => {
    // Dado que el estudiante completó el borrador y salió con «Cancelar».
    await prepararBorrador(page);
    await page.getByRole('link', { name: 'Cancelar', exact: true }).click();

    // Cuando vuelve a pulsar «Crear proyecto».
    await page.getByRole('link', { name: 'Crear proyecto', exact: true }).click();

    // Entonces el formulario recupera el nombre, la descripción y la portada.
    await expect(
        page.getByRole('textbox', { name: 'Nombre del proyecto', exact: true }),
    ).toHaveValue(nombreBorrador);
    await expect(
        page.getByRole('textbox', { name: 'Descripción', exact: true }),
    ).toHaveValue(descripcionBorrador);
    await expect(
        page.getByRole('img', {
            name: `Vista previa de la portada: ${nombrePortada}`,
            exact: true,
        }),
    ).toBeVisible();
});

test('CA12b - Visualizar información escrita de un proyecto no guardado después de pulsar el logo Croma', async ({ page }) => {
    // Dado que el estudiante completó el borrador y salió con el logo «Croma».
    await prepararBorrador(page);
    await page.getByRole('link', { name: 'Croma, mis proyectos', exact: true }).click();

    // Cuando vuelve a pulsar «Crear proyecto».
    await page.getByRole('link', { name: 'Crear proyecto', exact: true }).click();

    // Entonces el formulario recupera el nombre, la descripción y la portada.
    await expect(
        page.getByRole('textbox', { name: 'Nombre del proyecto', exact: true }),
    ).toHaveValue(nombreBorrador);
    await expect(
        page.getByRole('textbox', { name: 'Descripción', exact: true }),
    ).toHaveValue(descripcionBorrador);
    await expect(
        page.getByRole('img', {
            name: `Vista previa de la portada: ${nombrePortada}`,
            exact: true,
        }),
    ).toBeVisible();
});