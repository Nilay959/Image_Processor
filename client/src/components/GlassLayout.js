import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <Navbar />
      <main className="pt-24">{children}</main>
    </div>
  );
}
