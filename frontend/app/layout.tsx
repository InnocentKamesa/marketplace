import { SidebarProvider } from "@/components/ui/sidebar";
import "./globals.css";
import SideBar from "./components/sidebar";
import { Inter, Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-poppins',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // Tailwind will read this variable
});


export default function RootLayout({

  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
    ><head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-zinc-50 h-sm w-sm">
        <SidebarProvider>
          <SideBar />
          {children}
        </SidebarProvider>
      </body>
    </html>
  );
}
