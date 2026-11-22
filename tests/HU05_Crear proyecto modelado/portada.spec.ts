import { expect, test } from '@playwright/test';

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

test('CA06 - Carga una imagen de portada válida', async ({ page }) => {
    const nombreArchivo = 'SampleJPGImage_4mb.webp';

    // Dado que el estudiante está en «Crear proyecto».
    await page.getByRole('link', { name: 'Crear proyecto', exact: true }).click();

    // Cuando pulsa «Subir imagen» y elige una imagen de hasta 4 MB.
    const selector = page.waitForEvent('filechooser');
    await page.getByText('Subir imagen', { exact: true }).click();
    const archivo = await selector;
    await archivo.setFiles(`public/tests/${nombreArchivo}`);

    // Entonces se muestra la vista previa y el botón «Quitar imagen».
    await expect(
        page.getByRole('img', { name: `Vista previa de la portada: ${nombreArchivo}`, exact: true }),
    ).toBeVisible();
    await expect(
        page.getByRole('button', { name: 'Quitar imagen', exact: true }),
    ).toBeVisible();
});

test('CA07 - Quita la portada y deja vacía la vista previa', async ({ page }) => {
    const nombreArchivo = 'SampleJPGImage_4mb.webp';

    // Dado que el estudiante está en «Crear proyecto» y cargó una portada.
    await page.getByRole('link', { name: 'Crear proyecto', exact: true }).click();

    const selector = page.waitForEvent('filechooser');
    await page.getByText('Subir imagen', { exact: true }).click();
    const archivo = await selector;
    await archivo.setFiles(`public/tests/${nombreArchivo}`);

    await expect(
        page.getByRole('img', {
            name: `Vista previa de la portada: ${nombreArchivo}`,
            exact: true,
        }),
    ).toBeVisible();

    // Cuando pulsa «Quitar imagen».
    await page.getByRole('button', { name: 'Quitar imagen', exact: true }).click();

    // Entonces la vista previa queda vacía.
    await expect(
        page.getByRole('img', { name: 'Sin imagen de portada', exact: true }),
    ).toBeVisible();
});

test('CA08 - Rechaza una imagen de más de 4 MB, sin portada cargada', async ({ page }) => {
    const nombreArchivo = 'SampleJPGImage_5mb.jpg';

    // Dado que el estudiante está en «Crear proyecto» sin una portada cargada.
    await page.getByRole('link', { name: 'Crear proyecto', exact: true }).click();

    const portadaVacia = page.getByRole('img', {
        name: 'Sin imagen de portada',
        exact: true,
    });
    await expect(portadaVacia).toBeVisible();

    // Cuando elige una imagen de más de 4 MB.
    const selector = page.waitForEvent('filechooser');
    await page.getByText('Subir imagen', { exact: true }).click();
    const archivo = await selector;
    await archivo.setFiles(`public/tests/${nombreArchivo}`);

    // Entonces la vista previa sigue vacía y se muestra la advertencia.
    await expect(portadaVacia).toBeVisible();
    await expect(
        page.getByText(
            'La imagen supera los 4 MB. Usa una más ligera. El proyecto se creará sin portada.',
            { exact: true },
        ),
    ).toBeVisible();
});

test('CA09 - Rechaza un archivo que no es imagen', async ({ page }) => {
    const nombreArchivo = 'test.txt';

    // Dado que el estudiante está en «Crear proyecto» sin una portada cargada.
    await page.getByRole('link', { name: 'Crear proyecto', exact: true }).click();

    const portadaVacia = page.getByRole('img', {
        name: 'Sin imagen de portada',
        exact: true,
    });
    await expect(portadaVacia).toBeVisible();

    // Cuando elige un archivo que no es una imagen.
    const selector = page.waitForEvent('filechooser');
    await page.getByText('Subir imagen', { exact: true }).click();
    const archivo = await selector;
    await archivo.setFiles(`public/tests/${nombreArchivo}`);

    // Entonces la vista previa sigue vacía y se muestra la advertencia.
    await expect(portadaVacia).toBeVisible();
    await expect(
        page.getByText(
            'El archivo debe ser una imagen. El proyecto se creará sin portada.',
            { exact: true },
        ),
    ).toBeVisible();
});

test('CA10a - Conserva la portada al elegir una imagen de más de 4 MB', async ({ page }) => {
    const portadaValida = 'SampleJPGImage_4mb.webp';
    const archivoInvalido = 'SampleJPGImage_5mb.jpg';

    // Dado que el estudiante está en «Crear proyecto» y cargó una portada válida.
    await page.getByRole('link', { name: 'Crear proyecto', exact: true }).click();
    const subirImagen = page.getByText('Subir imagen', { exact: true });

    const selectorInicial = page.waitForEvent('filechooser');
    await subirImagen.click();
    const archivoInicial = await selectorInicial;
    await archivoInicial.setFiles(`public/tests/${portadaValida}`);

    const vistaPrevia = page.getByRole('img', {
        name: `Vista previa de la portada: ${portadaValida}`,
        exact: true,
    });
    await expect(vistaPrevia).toBeVisible();

    // Cuando elige una imagen de más de 4 MB.
    const selectorReemplazo = page.waitForEvent('filechooser');
    await subirImagen.click();
    const archivoReemplazo = await selectorReemplazo;
    await archivoReemplazo.setFiles(`public/tests/${archivoInvalido}`);

    // Entonces conserva la portada original y muestra la advertencia.
    await expect(
        page.getByText('Archivo inválido, se mantiene la portada actual.', { exact: true }),
    ).toBeVisible();
    await expect(vistaPrevia).toBeVisible();
});

test('CA10b - Conserva la portada al elegir un archivo que no es imagen', async ({ page }) => {
    const portadaValida = 'SampleJPGImage_4mb.webp';
    const archivoInvalido = 'test.txt';

    // Dado que el estudiante está en «Crear proyecto» y cargó una portada válida.
    await page.getByRole('link', { name: 'Crear proyecto', exact: true }).click();
    const subirImagen = page.getByText('Subir imagen', { exact: true });

    const selectorInicial = page.waitForEvent('filechooser');
    await subirImagen.click();
    const archivoInicial = await selectorInicial;
    await archivoInicial.setFiles(`public/tests/${portadaValida}`);

    const vistaPrevia = page.getByRole('img', {
        name: `Vista previa de la portada: ${portadaValida}`,
        exact: true,
    });
    await expect(vistaPrevia).toBeVisible();

    // Cuando elige un archivo que no es una imagen.
    const selectorReemplazo = page.waitForEvent('filechooser');
    await subirImagen.click();
    const archivoReemplazo = await selectorReemplazo;
    await archivoReemplazo.setFiles(`public/tests/${archivoInvalido}`);

    // Entonces conserva la portada original y muestra la advertencia.
    await expect(
        page.getByText('Archivo inválido, se mantiene la portada actual.', { exact: true }),
    ).toBeVisible();
    await expect(vistaPrevia).toBeVisible();
});