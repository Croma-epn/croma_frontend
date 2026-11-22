import { expect, test } from '@playwright/test';

const casos = [
    { id: 'CA10a', campo: 'Contraseña' },
    { id: 'CA10b', campo: 'Confirmar contraseña' },
];

for (const { id, campo } of casos) {
    test(`${id} - Mostrar u ocultar el campo ${campo}`, async ({ page }) => {
        // Dado que el usuario escribe una contraseña en el registro.
        await page.goto('http://localhost:3000/autenticacion/registro');

        const entrada = page.getByLabel(campo, { exact: true });
        await entrada.fill('Croma123');
        await expect(entrada).toHaveAttribute('type', 'password');

        // Cuando pulsa el ojo, el valor se vuelve visible.
        await page.getByRole('button', {
            name: `Mostrar ${campo.toLowerCase()}`,
            exact: true,
        }).click();
        await expect(entrada).toHaveAttribute('type', 'text');
        await expect(entrada).toHaveValue('Croma123');

        // Cuando vuelve a pulsar el ojo, el valor se oculta y se conserva.
        await page.getByRole('button', {
            name: `Ocultar ${campo.toLowerCase()}`,
            exact: true,
        }).click();
        await expect(entrada).toHaveAttribute('type', 'password');
        await expect(entrada).toHaveValue('Croma123');
    });
}