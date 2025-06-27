import type { Metadata } from 'next';
import { ConvexClientProvider } from "./ConvexClientProvider";
import './globals.css';

export const metadata: Metadata = {
  title: 'Easy Viagens',
  description: 'A sua viagem muito mais barata',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br">
      <body>
         <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  )
}
