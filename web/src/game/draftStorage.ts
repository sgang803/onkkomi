import type { Layer } from "@/game/dressUpTypes";

/** 꾸미기 결과(JSON) — sessionStorage */
export const DRAFT_STORAGE_KEY = "dressup_latest_draft_v2";

/** 홈에서 입력한 닉네임 — sessionStorage (결과보기 시 드래프트에 합침) */
export const NICKNAME_STORAGE_KEY = "dressup_nickname";

export type DraftStage = {
  logicalW: number;
  logicalH: number;
};

export type SavedDraft = {
  characterId: string;
  stage: DraftStage;
  layers: Layer[];
  /** 홈에서 입력한 닉네임 (없으면 결과에서 기본 문구) */
  nickname?: string;
};
