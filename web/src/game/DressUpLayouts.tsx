"use client";

import styled, { css } from "styled-components";

import {
  PAGE_BG_DESKTOP,
  PAGE_BG_PLAY,
  PAGE_BG_RESULT,
} from "@/game/pageBackgrounds";
import { THEME } from "@/game/themeColors";
import { Button, Card, Page } from "@/ui/primitives";

/** 1페이지 포인트 = 테마 액센트 */
const HOME_ACCENT = THEME.accent;

/** 1페이지 전용 — 모바일 상단 여백 (노치는 safe-area 가산) · 양쪽 여백 넉넉히 */
export const HomePage = styled(Page)`
  background: transparent;
  /* Page 기본 align-items: center 가 자식 폭을 밀어낼 수 있어 stretch */
  align-items: stretch;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;

  padding-left: max(48px, env(safe-area-inset-left));
  padding-right: max(48px, env(safe-area-inset-right));

  @media (min-width: 769px) {
    padding-left: max(64px, env(safe-area-inset-left));
    padding-right: max(64px, env(safe-area-inset-right));
  }

  @media (max-width: 800px) {
    padding-top: calc(
      clamp(36px, 9vw, 56px) + env(safe-area-inset-top)
    );
    padding-left: max(48px, env(safe-area-inset-left));
    padding-right: max(48px, env(safe-area-inset-right));
  }
`;

/** 모바일 풀스크린 배경 공통 (cover) */
const mobilePageShell = css`
  position: relative;
  isolation: isolate;
  min-height: 100vh;
  min-height: 100dvh;
  min-height: 100svh;
  width: 100%;
  box-sizing: border-box;
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  background-color: #e8eaf0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

/** 1페이지 하단 CTA — 모바일에서 영역 밖으로 나가지 않게 · 포인트 컬러 배경 */
export const HomeCTAButton = styled(Button)`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  ${({ $primary }) =>
    $primary &&
    css`
      background: ${HOME_ACCENT};
      color: #fff;
      &:hover {
        filter: brightness(1.05);
      }
      &:active {
        filter: brightness(0.95);
      }
    `}
`;

/** 1페이지 — 캐릭터 선택 (모바일 배경·톤은 2페이지 꾸미기와 동일) */
export const HomeAppBackground = styled.div`
  ${mobilePageShell}
  background-color: ${THEME.lightYellow};
  background-image: url(${PAGE_BG_PLAY});
  overflow-x: hidden;
  max-width: 100%;

  @media (min-width: 801px) {
    background-image: url(${PAGE_BG_DESKTOP});
  }
`;

/** 2페이지 — 꾸미기 (배경 이미지 밑 톤: 연한 노랑) */
export const PlayBackground = styled.div`
  ${mobilePageShell}
  background-color: ${THEME.lightYellow};
  background-image: url(${PAGE_BG_PLAY});

  @media (min-width: 801px) {
    background-image: url(${PAGE_BG_DESKTOP});
  }
`;

/** 3페이지 — 결과 */
export const ResultAppBackground = styled.div`
  ${mobilePageShell}
  background-color: ${THEME.lightYellow};
  background-image: url(${PAGE_BG_RESULT});

  @media (min-width: 801px) {
    background-image: url(${PAGE_BG_DESKTOP});
  }
`;

/** 2·3페이지 공통 — 액센트 색 주버튼 */
export const AccentPrimaryButton = styled(Button)`
  ${({ $primary }) =>
    $primary &&
    css`
      background: ${THEME.accent};
      color: #fff;
      &:hover {
        filter: brightness(1.05);
      }
      &:active {
        filter: brightness(0.95);
      }
    `}
`;

/** 보조 버튼 (초기화·다시 편집 등) */
export const AccentSecondaryButton = styled(Button)`
  background: rgba(254, 234, 169, 0.65);
  color: #6b3d38;
  border: 1px solid ${THEME.lightRed};
`;

/** 3페이지 카드 — 연한 빨강 테두리·따뜻한 배경 */
export const ResultCard = styled(Card)`
  border-color: ${THEME.lightRed};
  background: rgba(255, 255, 255, 0.92);
  border-width: 2px;
`;

/** 한 장의 큰 캔버스: 위 = 캐릭터, 아래 = 아이템 그리드 */
export const PlayCanvas = styled.div`
  width: 100%;
  max-width: 520px;
  min-width: 0;
  margin: 0 auto;
  border-radius: 20px;
  overflow: hidden;
  background: #fff;
  border: 2px solid ${THEME.lightRed};
  box-shadow: 0 12px 36px rgba(229, 100, 94, 0.15);
  display: flex;
  flex-direction: column;
  min-height: min(88vh, 820px);
  min-height: min(88dvh, 820px);
  box-sizing: border-box;

  @media (max-width: 480px) {
    border-radius: 12px;
    max-width: 100%;
    box-shadow: 0 8px 24px rgba(229, 100, 94, 0.12);
  }
`;

/** 상단: 선택한 캐릭터 스테이지 */
export const CharacterSection = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 14px 12px 10px;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  background: linear-gradient(
    180deg,
    ${THEME.lightYellow} 0%,
    #fff 48%,
    ${THEME.lightRed} 100%
  );
`;

/** 도구줄: 결과 / 초기화 / 레이어 수 */
export const PlayToolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 12px;
  background: rgba(254, 234, 169, 0.55);
  border-top: 1px solid ${THEME.lightRed};
  border-bottom: 1px solid ${THEME.lightRed};
`;

export const ItemStripLabel = styled.div`
  font-weight: 800;
  font-size: 13px;
  color: ${THEME.accent};
  padding: 0 4px 8px;
`;

export const InventoryHint = styled.p`
  margin: 0 0 8px;
  font-size: 12px;
  line-height: 1.4;
  color: #9a5c58;
`;

/** 하단: 아이템 썸네일 그리드 (스크롤) */
export const ItemStripSection = styled.div`
  flex: 0 1 auto;
  max-height: min(38vh, 340px);
  max-height: min(38dvh, 340px);
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px 12px max(14px, env(safe-area-inset-bottom));
  background: #fff;
  border-top: 1px solid ${THEME.lightRed};
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
`;

/** 1fr 기본 min-size(auto) 때문에 칩 min-width로 가로가 밀려나지 않게 minmax(0,1fr) */
export const ItemGrid = styled.div`
  display: grid;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 6px;
  justify-items: center;
`;

export const StageActions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
`;

/** 입장 페이지: 데스크톱 좌/우 · 모바일 상(선택) / 하(미리보기) */
export const HomeShell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: stretch;
  width: 100%;
  max-width: min(1000px, 100%);
  margin: 0 auto;
  min-height: 0;
  min-width: 0;
  box-sizing: border-box;

  @media (min-width: 801px) {
    flex-direction: row;
    gap: 28px;
    min-height: 520px;
  }
`;

export const HomeLeft = styled.div`
  flex: 0 0 220px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  @media (max-width: 800px) {
    flex: 0 0 auto;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    gap: 12px;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    padding: 4px 0 12px;
    scrollbar-width: thin;
    box-sizing: border-box;
  }
`;

export const HomeRight = styled.div`
  flex: 1;
  min-width: 0;
  max-width: 100%;
  border-radius: 24px;
  background: #fff;
  border: 2px solid ${THEME.accent};
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-sizing: border-box;

  @media (max-width: 800px) {
    padding: 12px;
    border-radius: 20px;
    flex: 1 1 auto;
    width: 100%;
  }
`;

export const CharThumb = styled.button<{ $active?: boolean }>`
  appearance: none;
  border: 2px solid
    ${({ $active }) => ($active ? HOME_ACCENT : "rgba(0,0,0,0.08)")};
  background: #fff;
  border-radius: 16px;
  padding: 10px;
  cursor: pointer;
  transition: border-color 0.15s ease, transform 0.12s ease;
  width: 100%;
  max-width: 200px;

  &:hover {
    border-color: ${HOME_ACCENT};
    transform: translateY(-1px);
  }

  @media (max-width: 800px) {
    flex: 0 0 auto;
    width: 120px;
    min-width: 120px;
    max-width: 120px;
    height: 120px;
    min-height: 120px;
    max-height: 120px;
    padding: 6px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden;
  }
`;

export const CharThumbImg = styled.img`
  width: 100%;
  height: 160px;
  object-fit: contain;
  display: block;
  flex-shrink: 0;

  @media (max-width: 800px) {
    height: 72px;
    max-height: 72px;
  }
`;

export const CharThumbLabel = styled.div`
  margin-top: 8px;
  font-weight: 700;
  font-size: 13px;
  color: #444;

  @media (max-width: 800px) {
    margin-top: 4px;
    font-size: 11px;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const PreviewFrame = styled.div`
  width: 100%;
  max-width: 420px;
  aspect-ratio: 3 / 4;
  border-radius: 20px;
  background: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  /* 모바일: 최대 200×200, 좁은 폭에서는 부모 너비에 맞춤 */
  @media (max-width: 800px) {
    width: 100%;
    max-width: 200px;
    aspect-ratio: 1 / 1;
    height: auto;
    min-width: 0;
    min-height: 0;
  }
`;

export const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

/** 인벤 칩 30px 안쪽에 들어가는 미리보기(원본 PNG 크기 무시) */
const ITEM_CHIP_PX = 30;
const ITEM_CHIP_INNER_PX = ITEM_CHIP_PX - 4;

export const ItemDragChip = styled.button`
  appearance: none;
  border: 1px solid ${THEME.lightRed};
  background: rgba(242, 174, 171, 0.35);
  cursor: grab;
  padding: 0;
  position: relative;
  isolation: isolate;
  width: ${ITEM_CHIP_PX}px;
  height: ${ITEM_CHIP_PX}px;
  min-width: ${ITEM_CHIP_PX}px;
  min-height: ${ITEM_CHIP_PX}px;
  max-width: ${ITEM_CHIP_PX}px;
  max-height: ${ITEM_CHIP_PX}px;
  box-sizing: border-box;
  overflow: hidden;
  display: block;
  flex-shrink: 0;
  filter: drop-shadow(0 2px 6px rgba(229, 100, 94, 0.18));
  touch-action: none;
  border-radius: 6px;

  &:active {
    cursor: grabbing;
  }
`;

export const ItemDragImg = styled.img`
  position: absolute;
  left: 2px;
  top: 2px;
  /* % 높이 대신 고정 px — 큰 PNG가 원본 해상도로 튀어나가는 것 방지 */
  width: ${ITEM_CHIP_INNER_PX}px;
  height: ${ITEM_CHIP_INNER_PX}px;
  max-width: ${ITEM_CHIP_INNER_PX}px;
  max-height: ${ITEM_CHIP_INNER_PX}px;
  object-fit: contain;
  object-position: center;
  pointer-events: none;
  user-select: none;
  display: block;
  -webkit-touch-callout: none;
`;
