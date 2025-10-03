import React from "react";
import { Button } from "@/components/ui/button";

/**
 * PhaseGrid
 * Renders 12 placeholder boxes arranged in a 4 x 3 grid.
 * Each box is a small card styled with Tailwind and uses shadcn button variants
 * for consistent look-and-feel.
 */
export default function PhaseGrid({ mnemonic = "" }) {
  // Split mnemonic into words (up to 12). If not present, use placeholders.
  const words = mnemonic
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 12);

  const items = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, word: words[i] || `` }));

  return (
    <section className="w-full">
      <h3 className="mb-4 text-lg font-semibold">Phases</h3>
      <div className="grid grid-cols-4 gap-4">
        {items.map((it) => (
          <div key={it.id} className="flex items-stretch" aria-label={`Phase ${it.id} placeholder`}>
            <div className="w-full rounded-lg border border-border bg-card p-4 flex flex-col justify-between h-full">
              <div>
                <div className="text-sm text-muted-foreground">{`Word ${it.id}`}</div>
                <div className="mt-1 text-xl font-medium break-words">
                  {it.word || <span className="text-muted-foreground">(empty)</span>}
                </div>
              </div>
              
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
