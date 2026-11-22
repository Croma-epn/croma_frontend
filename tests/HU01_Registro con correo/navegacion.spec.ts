import { expect, test } from '@playwright/test';

test('CA01 - Acceso exitoso al formulario de registro', async ({ page }) => {
    // Dado que el usuario está en la página de inicio de sesión.
    await page.goto('http://localhost:3000/autenticacion/inicio-sesion');

    // Cuando pulsa el enlace para crear una cuenta.
    await page.getByRole('link', { name: 'Crear cuenta', exact: true }).click();

    // Entonces aparece el encabezado del formulario de registro.
    await expect(
        page.getByRole('heading', { name: 'Crea tu cuenta', exact: true }),
    ).toBeVisible();
});

test('CA11 - Volver a iniciar sesión', async ({ page }) => {
    // Dado que el usuario está en la página «Crea tu cuenta».
    await page.goto('http://localhost:3000/autenticacion/registro');
    await expect(
        page.getByRole('heading', { name: 'Crea tu cuenta', exact: true }),
    ).toBeVisible();

    // Cuando pulsa «Iniciar sesión».
    await page.getByRole('link', { name: 'Iniciar sesión', exact: true }).click();

    // Entonces se muestra la página de inicio de sesión.
    await expect(page).toHaveURL('http://localhost:3000/autenticacion/inicio-sesion');
    await expect(
        page.getByRole('heading', { name: 'Continúa tu trabajo', exact: true }),
    ).toBeVisible();
});