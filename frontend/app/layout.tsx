/* eslint-disable */
import type { Metadata } from "next";
import {Inter, IBM_Plex_Serif} from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  
});
const ibmPlexSerrif = IBM_Plex_Serif({
  subsets: ["latin"],  
  variable: "--font-ibm-plex-serif",
  weight: ['400','700'],
});

export const metadata: Metadata = {
  title: "Smart Banking",
  description: "Smart Banking is a modern banking platform for everyone",
  icons: {
    icon: '/icons/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      //Allows us to use same font across our entire application
        className={`${inter.variable} ${ibmPlexSerrif.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
