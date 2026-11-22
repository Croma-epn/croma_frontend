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

test('CA02 - Creación exitosa de un proyecto', async ({ page }) => {
    const nombreProyecto = `Proyecto prueba ${Date.now()}`;

    // Dado que el estudiante está en el formulario «Crear proyecto».
    await page.getByRole('link', { name: 'Crear proyecto', exact: true }).click();

    // Cuando escribe un nombre y pulsa «Crear proyecto».
    await page.getByRole('textbox', { name: 'Nombre del proyecto', exact: true })
        .fill(nombreProyecto);
    await page.getByRole('button', { name: 'Crear proyecto', exact: true }).click();

    // Entonces se muestra el lienzo vacío.
    await expect(
        page.getByRole('heading', { name: 'Tu modelo empieza aquí', exact: true }),
    ).toBeVisible();

    // Y aparece el mensaje de confirmación.
    await expect(
        page.getByText('Proyecto creado. Agrega tu primera pantalla.', { exact: true }),
    ).toBeVisible();
});