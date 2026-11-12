import { Inter, Manrope } from "next/font/google";

export const inter = Inter({ subsets: ['latin'], variable: '--fuente-inter' });

export const fuenteTitulo = Manrope({
    subsets: ['latin'],
    variable: '--fuente-manrope',
    weight: ['400', '500', '600', '700', '800'],
});