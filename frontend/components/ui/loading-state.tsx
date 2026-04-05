export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return <p className="text-sm text-slate-600">{message}</p>;
}
