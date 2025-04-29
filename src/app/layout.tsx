import { ReactNode } from "react";
import { Providers } from "./providers";
import { Layout } from "@/components/Layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digefx Monitor",
  description: "Monitoramento de veículos",
  applicationName: "Digefx Monitor",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Layout>
            {children}
          </Layout>
        </Providers>
      </body>
    </html>
  );
}