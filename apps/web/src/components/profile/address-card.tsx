import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Address } from '@/types/auth';

export function AddressCard({ address, onDelete, onDefault }: { address: Address; onDelete: () => void; onDefault: () => void }) {
  return (
    <article className="rounded-lg border p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-semibold"><MapPin size={16} />{address.title}{address.isDefault ? <span className="rounded bg-[var(--muted)] px-2 py-0.5 text-xs">Default</span> : null}</div>
          <p className="mt-2 text-sm text-gray-600">{address.fullName} · {address.phone}</p>
          <p className="mt-1 text-sm text-gray-500">{address.addressLine1}, {address.city}, {address.province}, {address.country}</p>
        </div>
        <div className="flex gap-2">
          {!address.isDefault ? <Button variant="outline" onClick={onDefault}>Default</Button> : null}
          <Button variant="outline" onClick={onDelete}>Delete</Button>
        </div>
      </div>
    </article>
  );
}
