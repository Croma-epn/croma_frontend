import { expect, test } from '@playwright/test';

test('CA03 - Error por nombre vacío', async ({ page }) => {
    const urlRegistro = 'http://localhost:3000/autenticacion/registro';

    // Dado que el usuario está en «Crea tu cuenta» y los demás campos son válidos.
    await page.goto(urlRegistro);
    await page.getByLabel('Correo electrónico', { exact: true }).fill('ana@example.com');
    await page.getByLabel('Contraseña', { exact: true }).fill('Croma123');
    await page.getByLabel('Confirmar contraseña', { exact: true }).fill('Croma123');

    const envios: string[] = [];
    page.on('request', (solicitud) => {
        if (solicitud.method() === 'POST' && solicitud.url() === urlRegistro) {
            envios.push(solicitud.url());
        }
    });

    // Cuando entra en «Nombre completo» y sale del campo sin escribir.
    const nombre = page.getByLabel('Nombre completo', { exact: true });
    await nombre.click();
    await nombre.press('Tab');

    // Entonces se muestra el mensaje de nombre obligatorio.
    const mensaje = page.getByText('Escribe tu nombre completo.', { exact: true });
    await expect(mensaje).toBeVisible();

    // Cuando pulsa «Crear cuenta».
    await page.getByRole('button', { name: 'Crear cuenta', exact: true }).click();

    // Entonces el error sigue visible y el formulario no se envía.
    await expect(mensaje).toBeVisible();
    await expect(page).toHaveURL(urlRegistro);
    expect(envios).toHaveLength(0);
});

test('CA04 - Error por correo vacío', async ({ page }) => {
    const urlRegistro = 'http://localhost:3000/autenticacion/registro';

    // Dado que el usuario está en «Crea tu cuenta» y los demás campos son válidos.
    await page.goto(urlRegistro);
    await page.getByLabel('Nombre completo', { exact: true }).fill('Ana Pérez');
    await page.getByLabel('Contraseña', { exact: true }).fill('Croma123');
    await page.getByLabel('Confirmar contraseña', { exact: true }).fill('Croma123');

    const envios: string[] = [];
    page.on('request', (solicitud) => {
        if (solicitud.method() === 'POST' && solicitud.url() === urlRegistro) {
            envios.push(solicitud.url());
        }
    });

    // Cuando entra en «Correo electrónico» y sale del campo sin escribir.
    const correo = page.getByLabel('Correo electrónico', { exact: true });
    await correo.click();
    await correo.press('Tab');

    // Entonces se muestra «Ingresa tu correo.».
    const mensaje = page.getByText('Ingresa tu correo.', { exact: true });
    await expect(mensaje).toBeVisible();

    // Cuando pulsa «Crear cuenta».
    await page.getByRole('button', { name: 'Crear cuenta', exact: true }).click();

    // Entonces el mensaje sigue visible y el formulario no se envía.
    await expect(mensaje).toBeVisible();
    await expect(page).toHaveURL(urlRegistro);
    expect(envios).toHaveLength(0);
});

test('CA05 - Error por correo con formato inválido', async ({ page }) => {
    const urlRegistro = 'http://localhost:3000/autenticacion/registro';

    // Dado que el usuario está en «Crea tu cuenta».
    await page.goto(urlRegistro);

    // Preparamos los demás campos con datos válidos para aislar el error del correo.
    await page.getByLabel('Nombre completo', { exact: true }).fill('Ana Pérez');
    await page.getByLabel('Contraseña', { exact: true }).fill('Croma123');
    await page.getByLabel('Confirmar contraseña', { exact: true }).fill('Croma123');

    const envios: string[] = [];
    page.on('request', (solicitud) => {
        if (solicitud.method() === 'POST' && solicitud.url() === urlRegistro) {
            envios.push(solicitud.url());
        }
    });

    // Cuando escribe un correo con formato inválido.
    await page.getByLabel('Correo electrónico', { exact: true }).fill('ana');

    // Entonces se muestra «Ingresa un correo válido.».
    await expect(
        page.getByText('Ingresa un correo válido.', { exact: true }),
    ).toBeVisible();

    // Cuando pulsa «Crear cuenta».
    await page.getByRole('button', { name: 'Crear cuenta', exact: true }).click();

    // Entonces el formulario no se envía.
    await expect(page.locator('form')).toHaveAttribute('aria-busy', 'false');
    await expect(page).toHaveURL(urlRegistro);
    expect(envios).toHaveLength(0);
});

test('CA06 - Error por correo ya registrado', async ({ page }) => {
    const correoRegistrado = process.env.CROMA_TEST_CORREO;

    if (!correoRegistrado) {
        throw new Error('Configura CROMA_TEST_CORREO en .env.');
    }

    // Dado que el usuario está en «Crea tu cuenta».
    await page.goto('http://localhost:3000/autenticacion/registro');
    await page.getByLabel('Nombre completo', { exact: true }).fill('Ana Pérez');
    await page.getByLabel('Contraseña', { exact: true }).fill('Croma123');
    await page.getByLabel('Confirmar contraseña', { exact: true }).fill('Croma123');

    // Cuando escribe un correo que ya tiene una cuenta y pulsa «Crear cuenta».
    await page.getByLabel('Correo electrónico', { exact: true }).fill(correoRegistrado);
    await page.getByRole('button', { name: 'Crear cuenta', exact: true }).click();

    // Entonces se muestra el mensaje de correo ya registrado.
    await expect(
        page.getByText('Este correo ya tiene una cuenta.', { exact: true }),
    ).toBeVisible();
});

test('CA07 - Error por contraseña de menos de 6 caracteres', async ({ page }) => {
    const urlRegistro = 'http://localhost:3000/autenticacion/registro';

    // Dado que el usuario está en «Crea tu cuenta».
    await page.goto(urlRegistro);

    // Datos de preparación para que el único error sea la longitud.
    await page.getByLabel('Nombre completo', { exact: true }).fill('Ana Pérez');
    await page.getByLabel('Correo electrónico', { exact: true }).fill('ana@example.com');
    await page.getByLabel('Confirmar contraseña', { exact: true }).fill('Croma');

    // Cuando escribe una contraseña de menos de 6 caracteres.
    await page.getByLabel('Contraseña', { exact: true }).pressSequentially('Croma');

    // Entonces se muestra «Usa al menos 6 caracteres.».
    await expect(
        page.getByText('Usa al menos 6 caracteres.', { exact: true }),
    ).toBeVisible();

    let envios = 0;
    page.on('request', (solicitud) => {
        if (solicitud.method() === 'POST' && solicitud.url() === urlRegistro) {
            envios += 1;
        }
    });

    // Cuando pulsa «Crear cuenta».
    await page.getByRole('button', { name: 'Crear cuenta', exact: true }).click();

    // Entonces no se envía el formulario.
    expect(envios).toBe(0);
});

const casosCA08 = [
    { id: 'CA08a', descripcion: 'la confirmación de contraseña es distinta', confirmacion: 'Croma456' },
    { id: 'CA08b', descripcion: 'la confirmación de contraseña queda vacía', confirmacion: '' },
];

for (const { id, descripcion, confirmacion } of casosCA08) {
    test(`${id} - Error si ${descripcion}`, async ({ page }) => {
        const urlRegistro = 'http://localhost:3000/autenticacion/registro';

        // Dado que el usuario está en «Crea tu cuenta» con los demás campos válidos.
        await page.goto(urlRegistro);
        await page.getByLabel('Nombre completo', { exact: true }).fill('Ana Pérez');
        await page.getByLabel('Correo electrónico', { exact: true }).fill('ana@example.com');
        await page.getByLabel('Contraseña', { exact: true }).fill('Croma123');

        // Cuando escribe una confirmación distinta o deja el campo vacío.
        const campo = page.getByLabel('Confirmar contraseña', { exact: true });
        await campo.click();

        if (confirmacion !== '') {
            await campo.fill(confirmacion);
        }

        await campo.press('Tab');

        await campo.fill(confirmacion);

        // Entonces se muestra «Las contraseñas deben coincidir.».
        await expect(
            page.getByText('Las contraseñas deben coincidir.', { exact: true }),
        ).toBeVisible();

        let envios = 0;
        page.on('request', (solicitud) => {
            if (solicitud.method() === 'POST' && solicitud.url() === urlRegistro) {
                envios += 1;
            }
        });

        // Cuando pulsa «Crear cuenta».
        await page.getByRole('button', { name: 'Crear cuenta', exact: true }).click();

        // Entonces el formulario no se envía.
        expect(envios).toBe(0);
    });
}

test('CA09 - Limita el nombre completo a 100 caracteres', async ({ page }) => {
    // Dado que el usuario está en el formulario de registro.
    await page.goto('http://localhost:3000/autenticacion/registro');

    const campoNombre = page.getByLabel('Nombre completo', { exact: true });
    const nombreDe100Caracteres = 'a'.repeat(100);

    // Cuando escribe 100 caracteres.
    await campoNombre.fill(nombreDe100Caracteres);

    // Entonces aparece la advertencia y se conservan los 100 caracteres.
    await expect(campoNombre).toHaveValue(nombreDe100Caracteres);
    await expect(
        page.getByText('Alcanzaste el máximo de 100 caracteres.', { exact: true }),
    ).toBeVisible();

    // Si intenta escribir un carácter más, el valor sigue igual.
    await campoNombre.press('End');
    await campoNombre.press('b');
    await expect(campoNombre).toHaveValue(nombreDe100Caracteres);
});
