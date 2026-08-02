'use client';

import type { ProductOption } from '@/types/catalog';

type ProductOptionSelectorProps = {
  options: ProductOption[];
  selected: Record<string, string>;
  onChange: (optionId: string, valueId: string) => void;
};

export function ProductOptionSelector({ options, selected, onChange }: ProductOptionSelectorProps) {
  return (
    <div className="space-y-4">
      {options.map((option) => (
        <fieldset key={option.id} className="space-y-2">
          <legend className="text-sm font-medium">{option.name}</legend>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const active = selected[option.id] === value.id;
              return (
                <button key={value.id} type="button" aria-pressed={active} onClick={() => onChange(option.id, value.id)} className={`rounded-md border px-3 py-2 text-sm ${active ? 'border-primary bg-primary/10' : 'border-border'}`}>
                  {value.value}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
