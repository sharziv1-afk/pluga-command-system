import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: 'המפקד - מערכת פיקוד פלוגתית טקטית',
  description: 'מערכת פיקוד ובקרה פלוגתית מתקדמת (Pluga Command System) המרכזת משימות, פערים, לוגיסטיקה, לו״ז וסד״כ בזמן אמת.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-tactical-bg text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
