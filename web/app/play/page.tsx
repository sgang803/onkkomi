"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import DragDressUp from "@/game/DragDressUp";
import { EnLine } from "@/ui/Bilingual";

function PlayInner() {
  const params = useSearchParams();
  const characterId = params.get("characterId") ?? "1";
  return <DragDressUp characterId={characterId} />;
}

export default function PlayPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: 24, textAlign: "center", color: "#6b4540" }}>
          로딩 중…
          <EnLine style={{ marginTop: 6, color: "#9a5c58" }}>Loading…</EnLine>
        </div>
      }
    >
      <PlayInner />
    </Suspense>
  );
}

