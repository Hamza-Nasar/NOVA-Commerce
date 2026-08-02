'use client';

import { create } from 'zustand';

type CatalogState = {
  selectedVariantId: string | null;
  selectedOptions: Record<string, string>;
  setSelectedVariant: (variantId: string | null) => void;
  setSelectedOption: (optionId: string, valueId: string) => void;
  resetSelection: () => void;
};

export const useCatalogStore = create<CatalogState>((set) => ({
  selectedVariantId: null,
  selectedOptions: {},
  setSelectedVariant: (selectedVariantId) => set({ selectedVariantId }),
  setSelectedOption: (optionId, valueId) => set((state) => ({ selectedOptions: { ...state.selectedOptions, [optionId]: valueId } })),
  resetSelection: () => set({ selectedVariantId: null, selectedOptions: {} }),
}));
