import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carrito | bea millis",
  description: "Revisa tu carrito y finaliza tu pedido por WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
