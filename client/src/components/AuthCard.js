export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-5">
      <div className="w-full max-w-sm rounded-3xl border bg-white p-8">
        <header className="mb-8">
          <h2 className="text-2xl font-light">{title}</h2>
          <p className="text-xs text-zinc-500">{subtitle}</p>
        </header>

        {children}

        {footer && (
          <footer className="mt-6 text-center text-xs text-zinc-500">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
