export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]" aria-label="Loading" role="status">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--accent2)', borderTopColor: 'transparent' }}
        />
        <span className="text-sm font-medium" style={{ color: 'var(--muted)' }}>Loading…</span>
      </div>
    </div>
  )
}
