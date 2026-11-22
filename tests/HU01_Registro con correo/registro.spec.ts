import { expect, test } from '@playwright/test';
import { randomUUID } from 'node:crypto';

test('CA02 - Registra una cuenta exitosamente', async ({ page }) => {
    const correoNuevo = `croma-${randomUUID()}@test.com`;
    const contrasena = 'Croma1';

    // Dado que el usuario está en «Crea tu cuenta».
    await page.goto('http://localhost:3000/autenticacion/registro');

    // Cuando completa sus datos, repite la contraseña y pulsa «Crear cuenta».
    await page.getByLabel('Nombre completo', { exact: true }).fill('Ana Pérez');
    await page.getByLabel('Correo electrónico', { exact: true }).fill(correoNuevo);
    await page.getByLabel('Contraseña', { exact: true }).fill(contrasena);
    await page.getByLabel('Confirmar contraseña', { exact: true }).fill(contrasena);
    await page.getByRole('button', { name: 'Crear cuenta', exact: true }).click();

    // Entonces aparece el mensaje de confirmación.
    await expect(
        page.getByText('Cuenta creada correctamente.', { exact: true }),
    ).toBeVisible();

    // Y se muestra «Iniciar sesión» con el correo ya escrito.
    await expect(page).toHaveURL('http://localhost:3000/autenticacion/inicio-sesion');
    await expect(
        page.getByLabel('Correo electrónico', { exact: true }),
    ).toHaveValue(correoNuevo);
});