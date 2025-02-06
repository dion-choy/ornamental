import { Geist, Geist_Mono } from "next/font/google";
import { CookiesProvider } from 'next-client-cookies/server';

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ornamental",
  description: "Secret santa but better",
};

export default function RootLayout({ children }) {
  return (
	  <CookiesProvider>
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
	  </CookiesProvider>
  );
}
