import Link from 'next/link';

export function Pagination({ page, totalPages, basePath }: { page: number; totalPages: number; basePath: string }) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      {page > 1 ? <Link className="rounded-md border px-3 py-2 text-sm" href={`${basePath}?page=${page - 1}`}>Previous</Link> : null}
      <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
      {page < totalPages ? <Link className="rounded-md border px-3 py-2 text-sm" href={`${basePath}?page=${page + 1}`}>Next</Link> : null}
    </div>
  );
}
