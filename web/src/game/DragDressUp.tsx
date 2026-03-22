"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { CHARACTERS, ITEMS } from "@/game/assets";
import {
  AccentPrimaryButton,
  AccentSecondaryButton,
  CharacterSection,
  InventoryHint,
  ItemDragChip,
  ItemDragImg,
  ItemGrid,
  ItemStripLabel,
  ItemStripSection,
  PlayBackground,
  PlayCanvas,
  PlayToolbar,
  StageActions,
} from "@/game/DressUpLayouts";
import { Layer } from "@/game/dressUpTypes";
import { loadImageMeta } from "@/game/loadImageMeta";
import { STAGE_FIXED_WIDTH_PX, THEME } from "@/game/themeColors";
import { BtnKoEn, EnLine } from "@/ui/Bilingual";
import { Container, Page, Subtitle, Title } from "@/ui/primitives";
import {
  DRAFT_STORAGE_KEY,
  NICKNAME_STORAGE_KEY,
  type DraftStage,
} from "@/game/draftStorage";

type PaletteDragState = {
  mode: "palette";
  assetId: string;
  imageUrl: string;
  ghostX: number;
  ghostY: number;
};

type LayerDragState = {
  mode: "layer";
  layerId: string;
  offsetX: number;
  offsetY: number;
};

type DragState = PaletteDragState | LayerDragState | null;

export default function DragDressUp({ characterId }: { characterId: string }) {
  const router = useRouter();

  const character = useMemo(() => {
    return CHARACTERS.find((c) => c.id === characterId) ?? CHARACTERS[0];
  }, [characterId]);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const stageMetricsRef = useRef({
    left: 0,
    top: 0,
    domW: 1,
    domH: 1,
    logicalW: 512,
    logicalH: 512,
    scaleX: 1,
    scaleY: 1,
  });

  const [baseMeta, setBaseMeta] = useState<{ w: number; h: number } | null>(
    null
  );

  /** 스테이지 논리 크기 = 캐릭터 PNG 가로·세로(그대로 1:1) */
  const logicalW = baseMeta?.w ?? 512;
  const logicalH = baseMeta?.h ?? 512;

  const [outfitMetas, setOutfitMetas] = useState<
    Record<string, { w: number; h: number }>
  >({});
  const [layers, setLayers] = useState<Layer[]>([]);
  const [dragState, setDragState] = useState<DragState>(null);

  /** 하이드레이션: 서버와 첫 클라이언트 페인트에서 disabled 상태를 맞추기 위해 마운트 후에만 상호작용 허용 */
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const stageReady = mounted && baseMeta !== null;

  /**
   * 스테이지 ref만 바뀌면 레이어 좌표(스케일)가 갱신되지 않음 → 클라이언트 라우팅 직후 UI 깨짐.
   * 측정 후 tick 올려 리렌더 유도.
   */
  const [, setStageMeasureTick] = useState(0);

  const itemMetaList = useMemo(() => ITEMS.map((o) => o.id), []);

  const maxZ = useMemo(() => {
    return layers.reduce((m, l) => (l.z > m ? l.z : m), 0);
  }, [layers]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const applyRect = (rect: DOMRect) => {
      if (rect.width <= 0 || rect.height <= 0) return;
      const domW = rect.width;
      const domH = rect.height;
      const prev = stageMetricsRef.current;
      const scaleX = domW / logicalW;
      const scaleY = domH / logicalH;
      stageMetricsRef.current = {
        ...prev,
        left: rect.left,
        top: rect.top,
        domW,
        domH,
        logicalW,
        logicalH,
        scaleX,
        scaleY,
      };
      const firstLayout = prev.domW <= 1 || prev.domH <= 1;
      const scaleChanged =
        Math.abs(prev.scaleX - scaleX) > 1e-5 ||
        Math.abs(prev.scaleY - scaleY) > 1e-5 ||
        Math.abs(prev.domW - domW) > 0.5 ||
        Math.abs(prev.domH - domH) > 0.5;
      if (firstLayout || scaleChanged) {
        setStageMeasureTick((t) => t + 1);
      }
    };

    const measure = () => {
      applyRect(el.getBoundingClientRect());
    };

    /** 레이아웃·폰트·Soft navigation 직후 0크기로 측정되는 경우 대비 */
    const measureRaf = () => {
      requestAnimationFrame(() => {
        measure();
        requestAnimationFrame(measure);
      });
    };

    measureRaf();

    const ro = new ResizeObserver(() => {
      measureRaf();
    });
    ro.observe(el);

    const onResize = () => measureRaf();
    window.addEventListener("resize", onResize);

    /** 스크롤 시 getBoundingClientRect 보정(포인터 좌표용). 리렌더는 스케일 변할 때만 */
    const onScroll = () => measure();
    window.addEventListener("scroll", onScroll, true);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [logicalW, logicalH]);

  useEffect(() => {
    let cancelled = false;
    setBaseMeta(null);
    loadImageMeta(character.baseImageUrl)
      .then((meta) => {
        if (cancelled) return;
        setBaseMeta(meta);
      })
      .catch(() => {
        if (cancelled) return;
        setBaseMeta({ w: 512, h: 512 });
      });
    return () => {
      cancelled = true;
    };
  }, [character.baseImageUrl]);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      itemMetaList.map(async (assetId) => {
        const item = ITEMS.find((o) => o.id === assetId);
        if (!item) return [assetId, { w: 64, h: 64 }] as const;
        const meta = await loadImageMeta(item.imageUrl);
        return [assetId, meta] as const;
      })
    )
      .then((pairs) => {
        if (cancelled) return;
        const next: Record<string, { w: number; h: number }> = {};
        for (const [id, meta] of pairs) next[id] = meta;
        setOutfitMetas(next);
      })
      .catch(() => {
        if (cancelled) return;
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clientToLogical = (clientX: number, clientY: number) => {
    const m = stageMetricsRef.current;
    const x = (clientX - m.left) * (m.logicalW / m.domW);
    const y = (clientY - m.top) * (m.logicalH / m.domH);
    return { x, y };
  };

  const isPointInsideStage = (clientX: number, clientY: number) => {
    const m = stageMetricsRef.current;
    return (
      clientX >= m.left &&
      clientX <= m.left + m.domW &&
      clientY >= m.top &&
      clientY <= m.top + m.domH
    );
  };

  const bringLayerToTop = (layerId: string) => {
    setLayers((prev) => {
      const nextMaxZ = prev.reduce((m, l) => (l.z > m ? l.z : m), 0);
      return prev.map((l) =>
        l.id === layerId ? { ...l, z: nextMaxZ + 1 } : l
      );
    });
  };

  useEffect(() => {
    if (!dragState) return;

    const onPointerMove = (e: PointerEvent) => {
      if (!isPointInsideStage(e.clientX, e.clientY)) {
        return;
      }

      const { x, y } = clientToLogical(e.clientX, e.clientY);

      setDragState((prev) => {
        if (!prev) return prev;
        if (prev.mode === "palette") {
          return { ...prev, ghostX: x, ghostY: y };
        }
        return prev;
      });

      if (dragState.mode === "layer") {
        setLayers((prev) =>
          prev.map((l) =>
            l.id === dragState.layerId
              ? { ...l, x: x + dragState.offsetX, y: y + dragState.offsetY }
              : l
          )
        );
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (dragState?.mode === "palette") {
        if (isPointInsideStage(e.clientX, e.clientY)) {
          const { ghostX, ghostY, assetId, imageUrl } = dragState;
          const nextLayer: Layer = {
            id: crypto.randomUUID(),
            assetId,
            imageUrl,
            x: ghostX,
            y: ghostY,
            z: maxZ + 1,
          };
          setLayers((prev) => [...prev, nextLayer]);
        }
      }

      setDragState(null);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [dragState, maxZ]);

  const handleLayerPointerDown = (e: React.PointerEvent, layer: Layer) => {
    e.preventDefault();
    bringLayerToTop(layer.id);

    const { x, y } = clientToLogical(e.clientX, e.clientY);

    setDragState({
      mode: "layer",
      layerId: layer.id,
      offsetX: layer.x - x,
      offsetY: layer.y - y,
    });
  };

  const handlePalettePointerDown = (
    e: React.PointerEvent,
    assetId: string,
    imageUrl: string
  ) => {
    e.preventDefault();
    const lw = logicalW || stageMetricsRef.current.logicalW || 512;
    const lh = logicalH || stageMetricsRef.current.logicalH || 512;
    setDragState({
      mode: "palette",
      assetId,
      imageUrl,
      ghostX: lw * 0.42,
      ghostY: lh * 0.28,
    });
  };

  const drawStageLayers = useMemo(() => {
    return [...layers].sort((a, b) => a.z - b.z);
  }, [layers]);

  const itemSize = (assetId: string) => {
    const m = outfitMetas[assetId];
    return { w: m?.w ?? 64, h: m?.h ?? 64 };
  };

  const handleShowResult = () => {
    if (!baseMeta) return;
    let nicknameFromHome = "";
    try {
      nicknameFromHome = sessionStorage.getItem(NICKNAME_STORAGE_KEY) ?? "";
    } catch {
      // ignore
    }
    const trimmed = nicknameFromHome.trim();
    const draft = {
      characterId: character.id,
      stage: {
        logicalW,
        logicalH,
      } satisfies DraftStage,
      layers,
      ...(trimmed ? { nickname: trimmed } : {}),
    };
    sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    router.push("/result");
  };

  return (
    <PlayBackground>
      <Page style={{ background: "transparent" }}>
        <Container>
          <Title style={{ marginBottom: 6, color: THEME.accent }}>
            온꼬미즈 꾸미기
            <EnLine style={{ color: "#8a6b66", fontWeight: 500 }}>
              Onkkomiz Dress Up
            </EnLine>
          </Title>
          <Subtitle style={{ marginBottom: 14, color: "#6b4540" }}>
            아래 아이템을 <strong>드래그</strong>해 위 캐릭터에 올리세요. 올린
            레이어를 누르면 맨 앞으로 올라옵니다.
            <EnLine style={{ color: "#8a6b66", marginTop: 6 }}>
              Drag items onto the character. Tap a layer to bring it to the
              front.
            </EnLine>
          </Subtitle>

          <PlayCanvas>
            <CharacterSection>
              <div
                ref={stageRef}
                style={{
                  position: "relative",
                  width: STAGE_FIXED_WIDTH_PX,
                  flexShrink: 0,
                  margin: "0 auto",
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "none",
                  background: "#fff",
                  aspectRatio: `${logicalW} / ${logicalH}`,
                  touchAction: "none",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={character.baseImageUrl}
                  alt={character.name}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                />

                {drawStageLayers.map((l) => {
                  const { w: wLogical, h: hLogical } = itemSize(l.assetId);
                  const m = stageMetricsRef.current;
                  const left = l.x * m.scaleX;
                  const top = l.y * m.scaleY;
                  const width = wLogical * m.scaleX;
                  const height = hLogical * m.scaleY;

                  return (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={l.id}
                      src={l.imageUrl}
                      alt=""
                      draggable={false}
                      onPointerDown={(ev) => handleLayerPointerDown(ev, l)}
                      style={{
                        position: "absolute",
                        left,
                        top,
                        width,
                        height,
                        zIndex: l.z,
                        touchAction: "none",
                        cursor: "grab",
                        userSelect: "none",
                        pointerEvents: "auto",
                      }}
                    />
                  );
                })}

                {dragState?.mode === "palette" ? (
                  (() => {
                    const { w: wLogical, h: hLogical } = itemSize(
                      dragState.assetId
                    );
                    const m = stageMetricsRef.current;
                    const left = dragState.ghostX * m.scaleX;
                    const top = dragState.ghostY * m.scaleY;
                    const width = wLogical * m.scaleX;
                    const height = hLogical * m.scaleY;
                    return (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={dragState.imageUrl}
                        alt=""
                        draggable={false}
                        style={{
                          position: "absolute",
                          left,
                          top,
                          width,
                          height,
                          zIndex: maxZ + 1,
                          opacity: 0.85,
                          pointerEvents: "none",
                          userSelect: "none",
                        }}
                      />
                    );
                  })()
                ) : null}
              </div>
            </CharacterSection>

            <PlayToolbar>
              <AccentSecondaryButton
                type="button"
                onClick={() => {
                  router.push("/");
                }}
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1.2,
                }}
              >
                <BtnKoEn
                  ko="온꼬미즈 다시 선택하기"
                  en="Pick another character"
                />
              </AccentSecondaryButton>
              <StageActions style={{ width: "auto", margin: 0 }}>
                <AccentPrimaryButton
                  $primary
                  onClick={handleShowResult}
                  disabled={!stageReady}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1.2,
                  }}
                >
                  <BtnKoEn ko="결과보기 →" en="View result →" />
                </AccentPrimaryButton>
                <AccentSecondaryButton
                  onClick={() => {
                    setLayers([]);
                  }}
                  disabled={!stageReady}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1.2,
                  }}
                >
                  <BtnKoEn ko="초기화" en="Reset" />
                </AccentSecondaryButton>
              </StageActions>
            </PlayToolbar>

            <ItemStripSection>
              <ItemStripLabel>
                
                꾸미기 아이템 (Items) 클릭아니고 드래그(Drag) 하세요!
                </ItemStripLabel>
              <ItemGrid>
                {ITEMS.map((item) => (
                  <ItemDragChip
                    key={item.id}
                    type="button"
                    onPointerDown={(ev) =>
                      handlePalettePointerDown(ev, item.id, item.imageUrl)
                    }
                  >
                    <ItemDragImg
                      src={item.imageUrl}
                      alt={item.name}
                      draggable={false}
                    />
                  </ItemDragChip>
                ))}
              </ItemGrid>
            </ItemStripSection>
          </PlayCanvas>
        </Container>
      </Page>
    </PlayBackground>
  );
}
