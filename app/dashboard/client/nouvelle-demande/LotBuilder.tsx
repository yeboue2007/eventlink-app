'use client';

import { useState } from 'react';
import type { Category } from '@/lib/types';

export default function LotBuilder({ categories }: { categories: Category[] }) {
  const [lots, setLots] = useState<number[]>([0]);

  return (
    <div>
      <label className="text-sm font-medium text-navy">
        Prestations recherchées <span className="text-navy/50 font-normal">(ajoutez-en plusieurs si besoin, ex : sono + DJ + décoration)</span>
      </label>

      <div className="flex flex-col gap-3 mt-2">
        {lots.map((key) => (
          <div key={key} className="bg-canvas rounded-lg p-4 grid grid-cols-2 gap-3">
            <select name="lot_category_id" required className="border border-navy/15 rounded-lg px-3 py-2 col-span-2 bg-white">
              <option value="">Choisir une catégorie…</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
            <select name="lot_project_size" className="border border-navy/15 rounded-lg px-3 py-2 bg-white">
              <option value="standard">Projet standard</option>
              <option value="grand_projet">Grand projet</option>
            </select>
            <input
              name="lot_details"
              placeholder="Précisions (optionnel)"
              className="border border-navy/15 rounded-lg px-3 py-2 bg-white"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setLots((prev) => [...prev, Date.now()])}
        className="mt-3 text-sm font-semibold text-violet hover:underline"
      >
        + Ajouter une prestation
      </button>
    </div>
  );
}
