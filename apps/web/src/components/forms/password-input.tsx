'use client';

import { Eye, EyeOff } from 'lucide-react';
import { InputHTMLAttributes, useState } from 'react';
import { Button } from '@/components/ui/button';

export function PasswordInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex rounded-md border bg-background">
      <input {...props} type={visible ? 'text' : 'password'} className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none" />
      <Button type="button" variant="ghost" className="h-10 w-10 px-0" onClick={() => setVisible((value) => !value)} aria-label={visible ? 'Hide password' : 'Show password'}>
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </Button>
    </div>
  );
}
