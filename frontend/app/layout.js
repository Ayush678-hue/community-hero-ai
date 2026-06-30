import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'Community Hero AI - Hyperlocal Civic Problem Solver',
  description: 'Empowering Communities Through AI-Driven Civic Action. Report, verify, track, and resolve local community issues using artificial intelligence, maps, and gamification.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-editorial-bg text-editorial-dark">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6">
          {children}
        </main>
        <footer className="border-t border-editorial-border py-6 text-center text-xs text-slate-400">
          <p>© 2026 Community Hero AI. Empowering Communities Through AI-Driven Civic Action.</p>
        </footer>
      </body>
    </html>
  );
}
