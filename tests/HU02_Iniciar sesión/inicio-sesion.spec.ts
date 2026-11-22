import { expect, test } from '@playwright/test';

const urlInicioSesion = 'http://localhost:3000/autenticacion/inicio-sesion';

test('CA01 - Inicia de sesión exitoso', async ({ page }) => {
    const correo = process.env.CROMA_TEST_CORREO;
    const contrasena = process.env.CROMA_TEST_CONTRASENA;

    if (!correo || !contrasena) {
        throw new Error('Configura CROMA_TEST_CORREO y CROMA_TEST_CONTRASENA en .env.');
    }

    // Dado que un usuario registrado está en «Iniciar sesión».
    await page.goto(urlInicioSesion);

    // Cuando escribe su correo y contraseña y pulsa «Iniciar sesión».
    await page.getByLabel('Correo electrónico', { exact: true }).fill(correo);
    await page.getByLabel('Contraseña', { exact: true }).fill(contrasena);
    await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();

    // Entonces se muestra la página «Mis proyectos».
    await expect(
        page.getByRole('heading', { name: 'Mis proyectos', exact: true }),
    ).toBeVisible();

    // Y se muestra «Sesión iniciada correctamente.».
    await expect(
        page.getByText('Sesión iniciada correctamente.', { exact: true }),
    ).toBeVisible();
});

test('CA05a - Error por correo no registrado', async ({ page }) => {
    const correoNoRegistrado = "croma@example.com";

    // Dado que el usuario está en «Iniciar sesión».
    await page.goto(urlInicioSesion);

    // Cuando escribe un correo que no tiene cuenta y pulsa «Iniciar sesión».
    await page.getByLabel('Correo electrónico', { exact: true }).fill(correoNoRegistrado);
    await page.getByLabel('Contraseña', { exact: true }).fill('Croma123');
    await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();

    // Entonces se muestra el mensaje y el usuario sigue en «Iniciar sesión».
    await expect(page.getByText(
        'No encontramos una cuenta con esos datos. Revisa tus credenciales o crea una cuenta.',
        { exact: true },
    )).toBeVisible();
    await expect(page).toHaveURL(urlInicioSesion);
});

test('CA05b - Error por contraseña incorrecta', async ({ page }) => {
    const correo = process.env.CROMA_TEST_CORREO;
    const contrasena = process.env.CROMA_TEST_CONTRASENA;

    if (!correo || !contrasena) {
        throw new Error('Configura CROMA_TEST_CORREO y CROMA_TEST_CONTRASENA en .env.');
    }

    // Dado que el usuario está en «Iniciar sesión».
    await page.goto(urlInicioSesion);

    // Cuando escribe un correo registrado con una contraseña incorrecta y pulsa «Iniciar sesión».
    await page.getByLabel('Correo electrónico', { exact: true }).fill(correo);
    await page.getByLabel('Contraseña', { exact: true }).fill(`${contrasena}-incorrecta`);
    await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();

    // Entonces se muestra el mensaje y el usuario sigue en «Iniciar sesión».
    await expect(page.getByText(
        'No encontramos una cuenta con esos datos. Revisa tus credenciales o crea una cuenta.',
        { exact: true },
    )).toBeVisible();
    await expect(page).toHaveURL(urlInicioSesion);
});
