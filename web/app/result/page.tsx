"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  AccentPrimaryButton,
  AccentSecondaryButton,
  ResultAppBackground,
  ResultCard,
} from "@/game/DressUpLayouts";
import { THEME } from "@/game/themeColors";
import { BtnKoEn, EnLine } from "@/ui/Bilingual";
import { Container, Page, Subtitle, Title } from "@/ui/primitives";
import { CHARACTERS } from "@/game/assets";
import { loadImageMeta } from "@/game/loadImageMeta";
import {
  DRAFT_STORAGE_KEY,
  type SavedDraft,
} from "@/game/draftStorage";
import { DESKTOP_ONLY_MIN_WIDTH_PX } from "@/game/breakpoints";

function loadHTMLImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

async function copyTextToClipboard(text: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
}

/** Web Share API로 이미지 공유, 미지원 시 다운로드 (모바일용) */
async function shareOrDownloadPng(opts: {
  canvas: HTMLCanvasElement;
  nicknameLabel: string;
  onError: (msg: string) => void;
}): Promise<void> {
  const { canvas, nicknameLabel, onError } = opts;
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), "image/png");
  });
  if (!blob) {
    onError("이미지를 만들 수 없어요.");
    return;
  }

  const safeName = nicknameLabel.replace(/[^\w가-힣\-]/g, "_").slice(0, 24) || "onkkomiz";
  const filename = `온꼬미즈_${safeName}.png`;
  const file = new File([blob], filename, { type: "image/png" });
  const title = `${nicknameLabel}의 온꼬미즈`;
  const text = "온꼬미즈 꾸미기 결과";

  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    const withFiles = { title, text, files: [file] };
    if (navigator.canShare?.(withFiles)) {
      try {
        await navigator.share(withFiles);
        return;
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        // 그 외 실패 시 다운로드로 폴백
      }
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  a.click();
  URL.revokeObjectURL(url);
}

/** 넓은 PC(1400px+) — URL 복사. 태블릿·모바일은 이미지 공유 */
function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(
      `(min-width: ${DESKTOP_ONLY_MIN_WIDTH_PX}px)`
    );
    const apply = () => setDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return desktop;
}

export default function ResultPage() {
  const router = useRouter();
  const isDesktop = useIsDesktop();
  const [draft, setDraft] = useState<SavedDraft | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as SavedDraft;
      setDraft(parsed);
    } catch {
      // ignore
    }
  }, []);

  const character = useMemo(() => {
    if (!draft) return null;
    return CHARACTERS.find((c) => c.id === draft.characterId) ?? null;
  }, [draft]);

  const nicknameLabel = useMemo(() => {
    const n = draft?.nickname?.trim();
    return n && n.length > 0 ? n : "익명의 온꼬";
  }, [draft]);

  useEffect(() => {
    const run = async () => {
      if (!draft || !character) return;
      setError(null);

      try {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = draft.stage.logicalW;
        canvas.height = draft.stage.logicalH;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const baseImg = await loadHTMLImage(character.baseImageUrl);
        ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);

        const metasArr = await Promise.all(
          [...new Set(draft.layers.map((l) => l.imageUrl))].map(async (url) => {
            const m = await loadImageMeta(url);
            return [url, m] as const;
          })
        );
        const metaByUrl = Object.fromEntries(metasArr);

        const sorted = [...draft.layers].sort((a, b) => a.z - b.z);
        for (const l of sorted) {
          const img = await loadHTMLImage(l.imageUrl);
          const meta = metaByUrl[l.imageUrl] as
            | { w: number; h: number }
            | undefined;
          const iw = meta?.w ?? img.naturalWidth;
          const ih = meta?.h ?? img.naturalHeight;
          ctx.drawImage(img, l.x, l.y, iw, ih);
        }

        const url = canvas.toDataURL("image/png");
        setPreviewUrl(url);
      } catch (e) {
        setError(e instanceof Error ? e.message : "합성 실패");
      }
    };

    void run();
  }, [draft, character]);

  if (!draft) {
    return (
      <ResultAppBackground>
        <Page style={{ background: "transparent" }}>
          <Container>
            <Title style={{ color: THEME.accent }}>
              결과를 불러올 수 없어요
              <EnLine style={{ color: "#8a6b66", fontWeight: 500 }}>
                Couldn&apos;t load your result
              </EnLine>
            </Title>
            <Subtitle style={{ color: "#6b4540" }}>
              이전 페이지에서 드래그 후 `결과보기`를 눌러주세요.
              <EnLine style={{ color: "#8a6b66", marginTop: 6 }}>
                Go back, dress up, then tap &quot;View result&quot;.
              </EnLine>
            </Subtitle>
            <div style={{ marginTop: 12 }}>
              <AccentPrimaryButton
                $primary
                onClick={() => {
                  router.push("/");
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1.2,
                }}
              >
                <BtnKoEn ko="홈으로 이동 →" en="Go home →" />
              </AccentPrimaryButton>
            </div>
          </Container>
        </Page>
      </ResultAppBackground>
    );
  }

  return (
    <ResultAppBackground>
      <Page style={{ background: "transparent" }}>
        <Container>
          <div
            style={{
              width: "100%",
              textAlign: "center",
              marginTop: "clamp(28px, 7vw, 56px)",
              marginBottom: 4,
            }}
          >
            <Title
              style={{
                color: THEME.accent,
                margin: 0,
                marginBottom: 10,
              }}
            >
              완성! 정말 멋지네요!
              <EnLine style={{ color: "#8a6b66", fontWeight: 500 }}>
                All done! Looks amazing!
              </EnLine>
            </Title>
            <Subtitle
              style={{
                color: "#6b4540",
                margin: 0,
                maxWidth: 520,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {isDesktop
                ? "어때요? 마음에 드시나요?? 마음에 안들면 다시하기를 눌러서 더 멋지게 꾸며보세요!!"
                : "어때요? 마음에 드시나요?? 마음에 안들면 다시하기를 눌러서 더 멋지게 꾸며보세요!!"}
              <EnLine style={{ color: "#8a6b66", marginTop: 6 }}>
                {isDesktop
                  ? "Tap “Try again” to tweak your look. Screenshot to share your outfit."
                  : "Tap “Try again” to tweak your look."}
              </EnLine>
            </Subtitle>
          </div>

          {error ? (
            <ResultCard style={{ marginTop: 12, borderColor: THEME.accent }}>
              <div style={{ color: THEME.accent, fontWeight: 800 }}>{error}</div>
            </ResultCard>
          ) : null}

          <div
            style={{
              marginTop: 12,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              alignItems: "stretch",
            }}
          >
            {/* 캡처용: 닉네임 + 완성 이미지 한 블록 */}
            <ResultCard
              style={{
                maxWidth: 520,
                margin: "0 auto",
                width: "100%",
                padding: 16,
                background: "linear-gradient(180deg, #fff8f6 0%, #fff 100%)",
                border: `2px solid ${THEME.accent}33`,
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  fontWeight: 900,
                  fontSize: "clamp(1.1rem, 4vw, 1.35rem)",
                  color: THEME.accent,
                  marginBottom: 12,
                  letterSpacing: "-0.02em",
                }}
              >
                {nicknameLabel}
              </div>
              <div
                style={{
                  width: "100%",
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(107, 69, 64, 0.12)",
                }}
              >
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt={`${nicknameLabel}의 완성본`}
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                ) : (
                  <div style={{ padding: 18, color: "#9a5c58", textAlign: "center" }}>
                    뚝딱뚝딱 합성하는중…
                    <EnLine style={{ marginTop: 4, fontSize: 11, opacity: 0.9 }}>
                      Composing…
                    </EnLine>
                  </div>
                )}
              </div>
            </ResultCard>

            <canvas ref={canvasRef} style={{ display: "none" }} />

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                justifyContent: "center",
              }}
            >
              {isDesktop ? (
                <AccentPrimaryButton
                  $primary
                  disabled={isSharing}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1.2,
                  }}
                  onClick={async () => {
                    setIsSharing(true);
                    setError(null);
                    setUrlCopied(false);
                    try {
                      await copyTextToClipboard(window.location.href);
                      setUrlCopied(true);
                      window.setTimeout(() => setUrlCopied(false), 2500);
                    } catch (e) {
                      setError(
                        e instanceof Error ? e.message : "복사에 실패했어요."
                      );
                    } finally {
                      setIsSharing(false);
                    }
                  }}
                >
                  {urlCopied ? (
                    <BtnKoEn ko="복사됨!" en="Copied!" />
                  ) : isSharing ? (
                    <BtnKoEn ko="복사 중…" en="Copying…" />
                  ) : (
                    <BtnKoEn ko="URL 복사하기" en="Copy URL" />
                  )}
                </AccentPrimaryButton>
              ) : (
                <AccentPrimaryButton
                  $primary
                  disabled={isSharing || !previewUrl}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1.2,
                  }}
                  onClick={async () => {
                    const canvas = canvasRef.current;
                    if (!canvas) return;
                    setIsSharing(true);
                    setError(null);
                    try {
                      await shareOrDownloadPng({
                        canvas,
                        nicknameLabel,
                        onError: (msg) => setError(msg),
                      });
                    } catch (e) {
                      setError(
                        e instanceof Error ? e.message : "공유에 실패했어요."
                      );
                    } finally {
                      setIsSharing(false);
                    }
                  }}
                >
                  {isSharing ? (
                    <BtnKoEn ko="로딩 중…" en="Working…" />
                  ) : (
                    <BtnKoEn ko="공유하기" en="Share" />
                  )}
                </AccentPrimaryButton>
              )}

              <AccentSecondaryButton
                onClick={() => {
                  router.push(
                    `/play?characterId=${encodeURIComponent(draft.characterId)}`
                  );
                }}
                disabled={isSharing}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1.2,
                }}
              >
                <BtnKoEn ko="다시 하기" en="Try again" />
              </AccentSecondaryButton>
            </div>

            <p
              style={{
                margin: 0,
                textAlign: "center",
                color: "#9a5c58",
                fontSize: 12,
                lineHeight: 1.45,
              }}
            >
              {isDesktop
                ? "다른 사람에게 보내도 같은 꾸미기 결과는 보이지 않아요. 결과를 공유하려면 화면을 캡처해 주세요."
                : "친구와 공유하고 누가더 멋지게 꾸미나 자랑해보세요!"}
              <EnLine style={{ marginTop: 5, fontSize: 11, opacity: 0.92 }}>
                {isDesktop
                  ? "The link won’t show your outfit—screenshot to share."
                  : "Share with friends and show off your style!"}
              </EnLine>
            </p>
          </div>

          <footer
            style={{
              marginTop: "clamp(28px, 7vw, 44px)",
              paddingTop: 18,
              paddingBottom: "clamp(12px, 3vw, 20px)",
              borderTop: `1px solid ${THEME.accent}26`,
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 11,
                color: "#8a6b66",
                lineHeight: 1.55,
                letterSpacing: "0.02em",
              }}
            >
              © {new Date().getFullYear()} 온꼬미즈 꾸미기
            </p>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 11,
                color: "#a88882",
                lineHeight: 1.55,
                whiteSpace: "pre-line",
              }}
            >
              {`제작 · FUSE추추
문의 및 피드백 · @7ggxx

캐릭터·원본 이미지의 저작권은 ©ONKOMIZ에 있습니다. 본 페이지는 해당 자산을 활용해 제작·운영됩니다.

본 페이지·꾸미기 결과 화면 등 서비스 콘텐츠의 무단 복제·배포·상업적 이용을 금합니다.`}
            </p>
          </footer>
        </Container>
      </Page>
    </ResultAppBackground>
  );
}
