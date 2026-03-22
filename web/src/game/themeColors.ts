/** 1·2·3페이지 공통 무드 컬러 */
export const THEME = {
  accent: "#e5645e",
  lightRed: "#f2aeab",
  lightYellow: "#feeaa9",
} as const;

/**
 * 꾸미기 스테이지 가로(px) — 고정.
 * 논리 좌표(logicalW/H)와 비율로 세로만 정해지며, 뷰포트에 따라 늘어나지 않음.
 */
export const STAGE_FIXED_WIDTH_PX = 340;
