import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' };
export const Button = forwardRef<HTMLButtonElement, Props>(({ className, variant = 'default', ...props }, ref) => <button ref={ref} className={cn('inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50', variant === 'default' ? 'bg-primary text-primary-foreground hover:opacity-90' : 'border bg-transparent hover:bg-[var(--muted)]', className)} {...props} />);
Button.displayName = 'Button';
