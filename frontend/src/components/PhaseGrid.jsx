import React from "react";
// Assuming Button is not strictly needed for the layout, removed for brevity
// import { Button } from "@/components/ui/button"; 

/**
 * PhaseGrid - Alternative Implementation
 * Renders 12 placeholder boxes arranged in a 4 x 3 grid.
 * This version structures the word data into explicit rows for rendering.
 */
export default function PhaseGrid({ mnemonic = "" }) {
  const NUM_COLUMNS = 4;
  const NUM_ROWS = 3;
  const TOTAL_ITEMS = NUM_COLUMNS * NUM_ROWS;

  // 1. Process Mnemonic (same as original)
  const words = mnemonic
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, TOTAL_ITEMS);

  // 2. Create Flat Item Array (same as original)
  const flatItems = Array.from({ length: TOTAL_ITEMS }, (_, i) => ({ 
      id: i + 1, 
      word: words[i] || null 
  }));

  // 3. Structure Items into Rows (The main difference)
  const rows = [];
  for (let i = 0; i < NUM_ROWS; i++) {
    // Slice out the 4 items for the current row
    const start = i * NUM_COLUMNS;
    const end = start + NUM_COLUMNS;
    rows.push(flatItems.slice(start, end));
  }


  // --- Render ---
  return (
    <section className="w-full">
      <h3 className="mb-4 text-lg font-semibold">Phases (Alternative Grid)</h3>
      
      {/* Outer container remains a flex column, or just the section itself */}
      <div className="flex flex-col gap-4"> 
        {rows.map((row, rowIndex) => (
          // Use 'grid' for the row, explicitly defining the columns for better semantic grouping
          <div key={rowIndex} className="grid grid-cols-4 gap-4"> 
            {row.map((item) => (
              <div key={item.id} className="flex items-stretch" aria-label={`Phase ${item.id} placeholder`}>
                <div className="w-full rounded-lg border border-border bg-card p-4 flex flex-col justify-between h-full shadow-sm transition-shadow hover:shadow-md">
                  <div>
                    <div className="text-sm text-muted-foreground">{`Word ${item.id}`}</div>
                    <div className="mt-1 text-xl font-medium break-words">
                      {item.word || <span className="text-muted-foreground opacity-70">(empty)</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}