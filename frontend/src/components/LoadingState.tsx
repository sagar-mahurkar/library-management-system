export default function LoadingState({ label = "Loading..." }: { label?: string }) {
  return <div className="text-center py-5" role="status"><div className="spinner-border text-primary mb-3" /><div className="text-secondary">{label}</div></div>;
}
