export function Loading({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-slate-500">
      <div className="w-8 h-8 border-3 border-sky-200 border-t-sky-600 rounded-full animate-spin" />
      {message && <p className="mt-3 text-sm">{message}</p>}
    </div>
  )
}
