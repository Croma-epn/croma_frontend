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

test('CA01 - Accede al formulario Crear proyecto', async ({ page }) => {
    // Dado que el estudiante está en «Mis proyectos» gracias al beforeEach.

    // Cuando pulsa «Crear proyecto».
    await page.getByRole('link', { name: 'Crear proyecto', exact: true }).click();

    // Entonces se muestra el formulario «Crear proyecto».
    await expect(
        page.getByRole('heading', { name: 'Crear proyecto', exact: true }),
    ).toBeVisible();
});