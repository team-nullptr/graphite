export function BetaOverlay() {
  return (
    <div className="pointer-events-none absolute z-50 flex h-screen w-screen items-end justify-center p-4 opacity-30">
      <div className="rounded-full border border-slate-300 bg-slate-200 px-4 py-[0.5px]">beta</div>
    </div>
  );
}
