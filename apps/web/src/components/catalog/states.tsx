export function EmptyState({ title, description }: { title: string; description?: string }) {
  return <div className="rounded-xl border border-dashed p-10 text-center"><h3 className="font-semibold">{title}</h3>{description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}</div>;
}

export function ErrorState({ message }: { message: string }) {
  return <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">{message}</div>;
}

export function ProductSkeleton() {
  return <div className="h-72 animate-pulse rounded-xl bg-muted" />;
}
