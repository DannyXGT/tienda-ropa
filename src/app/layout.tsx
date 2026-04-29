import "./globals.css";
import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import { CartProvider } from "@/state/cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "bea millis",
  description: "Boutique online con estilos seleccionados y pedidos personalizados",
  icons: {
    icon: "/logo.jpeg",
    apple: "/logo.jpeg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-theme="light" suppressHydrationWarning>
      <body className={`${sans.variable} ${display.variable} bgTexture`}>
        <CartProvider>
          <Header />
          <main className="containerX py-6 md:py-8">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
