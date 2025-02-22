import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const font = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Social Media App',
	description: 'Social Media App built with Next.js',
	icons: {
		icon: '/images/logo.png',
	},
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${font.className} antialiased`}
      >
        navbar
        {children}
        footer
      </body>
    </html>
  );
}
