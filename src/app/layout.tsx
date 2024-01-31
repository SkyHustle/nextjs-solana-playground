import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SolanaProvider } from "@/components/solana/solana-provider";
import { ReactQueryProvider } from "./react-query-provider";
import NavBar from "@/components/ui/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solana Playground",
  description: "Experiment with Solana in your browser",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          <SolanaProvider>
            <NavBar />
            {children}
          </SolanaProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
