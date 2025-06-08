import { ReactNode } from "react";
import { Providers } from "./providers";
import { Layout } from "@/components/Layout";
import { Metadata } from "next";
import EmotionRegistry from "@/libs/EmotionRegistry";

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
        <EmotionRegistry>
          <Providers>
            <Layout>
              {children}
            </Layout>
          </Providers>
        </EmotionRegistry>
      </body>
    </html>
  );
}