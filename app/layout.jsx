import './globals.css';
import { NewsProvider } from './context/NewsContext';

export const metadata = {
  title: 'Nexus Haber',
  description: 'Yeni Nesil Haber Yazılımı',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        <NewsProvider>
          {children}
        </NewsProvider>
      </body>
    </html>
  );
}