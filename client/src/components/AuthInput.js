export default function AuthInput({ label, ...props }) {
  return (
    <label className="space-y-2 text-xs">
      <span className="uppercase tracking-widest text-zinc-400">
        {label}
      </span>
      <input
        {...props}
        className="w-full border-b border-zinc-200 bg-transparent py-2 text-sm focus:border-zinc-900 outline-none"
      />
    </label>
  );
}
