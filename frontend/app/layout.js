import "./globals.css";
import Navbar from "../components/Navbar";
import ToastProvider from "../components/ToastProvider";

export const metadata = {
  title: "RSVP Tracker",
  description: "Event RSVP management application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Navbar />

        <main className="mx-auto max-w-6xl px-6 py-8">
          {children}
        </main>

        <ToastProvider />
      </body>
    </html>
  );
}