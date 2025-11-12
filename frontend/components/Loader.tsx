export default function Loader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent border-zinc-300" />
      <div className="text-sm text-zinc-400">{message}</div>
    </div>
  );
}
