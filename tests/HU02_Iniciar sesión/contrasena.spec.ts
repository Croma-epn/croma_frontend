import { expect, test } from '@playwright/test';

test('CA06 - Mostrar y ocultar la contraseña', async ({ page }) => {
    // Dado que el usuario está en «Iniciar sesión» y escribió una contraseña.
    await page.goto('http://localhost:3000/autenticacion/inicio-sesion');
    const contrasena = page.getByLabel('Contraseña', { exact: true });
    await contrasena.fill('Croma123');

    // Cuando pulsa el ícono del ojo para mostrar la contraseña.
    await page.getByRole('button', { name: 'Mostrar contraseña', exact: true }).click();

    // Entonces la contraseña se muestra.
    await expect(contrasena).toHaveAttribute('type', 'text');

    // Cuando vuelve a pulsar el ícono del ojo.
    await page.getByRole('button', { name: 'Ocultar contraseña', exact: true }).click();

    // Entonces la contraseña se oculta.
    await expect(contrasena).toHaveAttribute('type', 'password');
});