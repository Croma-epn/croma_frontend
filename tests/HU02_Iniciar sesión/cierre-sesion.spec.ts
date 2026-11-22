import { expect, test, type Page } from '@playwright/test';

const urlInicioSesion = 'http://localhost:3000/autenticacion/inicio-sesion';
const urlProyectos = 'http://localhost:3000/proyectos';

async function abrirDialogoDeCierre(page: Page) {
    await page.getByRole('button', { name: /^Abrir menú de / }).click();
    await page.getByRole('menuitem', { name: 'Cerrar sesión', exact: true }).click();

    const dialogo = page.getByRole('dialog', { name: '¿Cerrar sesión?', exact: true });
    await expect(dialogo).toBeVisible();
    return dialogo;
}

test.beforeEach(async ({ page }) => {
    // Dado que el usuario inició sesión.
    const correo = process.env.CROMA_TEST_CORREO;
    const contrasena = process.env.CROMA_TEST_CONTRASENA;

    if (!correo || !contrasena) {
        throw new Error('Configura CROMA_TEST_CORREO y CROMA_TEST_CONTRASENA en .env.');
    }

    await page.goto(urlInicioSesion);
    await page.getByLabel('Correo electrónico', { exact: true }).fill(correo);
    await page.getByLabel('Contraseña', { exact: true }).fill(contrasena);
    await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();
    await expect(page).toHaveURL(urlProyectos);
});

test('CA07 - Solicitud de cierre de sesión', async ({ page }) => {
    // Cuando pulsa el avatar y elige «Cerrar sesión».
    await page.getByRole('button', { name: /^Abrir menú de / }).click();
    await page.getByRole('menuitem', { name: 'Cerrar sesión', exact: true }).click();

    // Entonces se muestra el diálogo con su título y mensaje.
    const dialogo = page.getByRole('dialog', { name: '¿Cerrar sesión?', exact: true });
    await expect(dialogo).toBeVisible();
    await expect(
        dialogo.getByText('Tus proyectos se mantienen guardados.', { exact: true }),
    ).toBeVisible();
});

test('CA08 - Cierra de sesión exitoso', async ({ page }) => {
    // Dado que el usuario ve el diálogo «¿Cerrar sesión?».
    const dialogo = await abrirDialogoDeCierre(page);

    // Cuando pulsa «Cerrar sesión» dentro del diálogo.
    await dialogo.getByRole('button', { name: 'Cerrar sesión', exact: true }).click();

    // Entonces se muestra «Iniciar sesión» y aparece «Sesión cerrada.».
    await expect(page).toHaveURL(urlInicioSesion);
    await expect(page.getByText('Sesión cerrada.', { exact: true })).toBeVisible();
});

test('CA09a - Cancelar el cierre de sesión con Seguir aquí', async ({ page }) => {
    // Dado que el usuario ve el diálogo «¿Cerrar sesión?».
    const dialogo = await abrirDialogoDeCierre(page);

    // Cuando pulsa «Seguir aquí».
    await dialogo.getByRole('button', { name: 'Seguir aquí', exact: true }).click();

    // Entonces el diálogo se cierra y el usuario sigue en «Mis proyectos».
    await expect(dialogo).toBeHidden();
    await expect(page).toHaveURL(urlProyectos);
});

test('CA09b - Cancelar el cierre de sesión con Escape', async ({ page }) => {
    // Dado que el usuario ve el diálogo «¿Cerrar sesión?».
    const dialogo = await abrirDialogoDeCierre(page);

    // Cuando pulsa Esc.
    await page.keyboard.press('Escape');

    // Entonces el diálogo se cierra y el usuario sigue en «Mis proyectos».
    await expect(dialogo).toBeHidden();
    await expect(page).toHaveURL(urlProyectos);
});

test('CA09c - Cancelar el cierre de sesión al pulsar fuera del diálogo', async ({ page }) => {
    // Dado que el usuario ve el diálogo «¿Cerrar sesión?».
    const dialogo = await abrirDialogoDeCierre(page);

    // Cuando pulsa en la esquina superior izquierda del fondo del diálogo.
    await page.locator('[data-slot="dialog-overlay"]').click({
        position: { x: 10, y: 10 },
    });

    // Entonces el diálogo se cierra y el usuario sigue en «Mis proyectos».
    await expect(dialogo).toBeHidden();
    await expect(page).toHaveURL(urlProyectos);
});
