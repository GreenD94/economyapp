import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/features/core/components/providers";
import { NavWrapper } from "@/features/navigation/components/NavWrapper.component";
import { AuthGuard } from "@/features/auth/components/AuthGuard.component";

export const metadata: Metadata = {
  title: "Economy App - Track Your Finances",
  description: "Personal finance tracker for earnings and expenses",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
        />
      </head>
      <body>
        <Providers>
          <AuthGuard>
            <NavWrapper />
            {children}
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
