"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import DragDressUp from "@/game/DragDressUp";

function PlayInner() {
  const params = useSearchParams();
  const characterId = params.get("characterId") ?? "1";
  return <DragDressUp characterId={characterId} />;
}

export default function PlayPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>로딩 중…</div>}>
      <PlayInner />
    </Suspense>
  );
}

