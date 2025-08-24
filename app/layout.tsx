import type { Metadata } from "next";
import {Poppins} from 'next/font/google'
import "./globals.css";

// const geistSans = localFont({
//   src: './fonts/GeistVF.woff',
//   variable: "--font-geist-sans",
//   weight: "100 900"
// });

// const geistMono = localFont({
//   src: './fonts/GeistMonoVF.woff',
//   variable: "--font-geist-mono",
//   weight: "100 900"
// });

const poppins = Poppins({
  subsets: ['latin'],
  weight: '400'
})

export const metadata: Metadata = {
  title: "Storage App",
  description: "unique way to store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
