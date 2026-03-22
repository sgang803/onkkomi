"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { CHARACTERS } from "@/game/assets";
import {
  CharThumb,
  CharThumbImg,
  CharThumbLabel,
  HomeAppBackground,
  HomeLeft,
  HomePage,
  HomeRight,
  HomeShell,
  HomeCTAButton,
  PreviewFrame,
  PreviewImg,
} from "@/game/DressUpLayouts";
import { BtnKoEn, EnLine } from "@/ui/Bilingual";
import { Container, Input, Subtitle } from "@/ui/primitives";
import { NICKNAME_STORAGE_KEY } from "@/game/draftStorage";

export default function Home() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(CHARACTERS[0]?.id ?? "1");
  const [nickname, setNickname] = useState("");

  const selected = useMemo(() => {
    return CHARACTERS.find((c) => c.id === selectedId) ?? CHARACTERS[0];
  }, [selectedId]);

  return (
    <HomeAppBackground>
      <HomePage>
        <Container style={{ gap: 8 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              marginBottom: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- public 로고 */}
            <img
              src="/logo.png"
              alt="온꼬미즈 꾸미기"
              width={320}
              height={120}
              style={{
                width: "min(92vw, 300px)",
                height: "auto",
                maxHeight: "clamp(60px, 16vw, 100px)",
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>

          <Subtitle
            style={{
              marginTop: 0,
              marginBottom: 0,
              maxWidth: "100%",
              wordBreak: "keep-all",
              overflowWrap: "break-word",
              textAlign: "center",
              lineHeight: 1.35,
            }}
          >
            꾸미고 싶은 온꼬미즈를 선택한 후 닉네임을 적고 아래 버튼을 눌러주세요🌸
            <EnLine style={{ color: "#8a6b66", marginTop: 6 }}>
              Pick an Onkkomiz, enter a nickname, then tap the button below.
            </EnLine>
          </Subtitle>

          <div
            style={{
              width: "100%",
              maxWidth: 420,
              margin: "0 auto 10px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <label
              style={{
                fontWeight: 800,
                color: "#6b4540",
                fontSize: "clamp(0.85rem, 3vw, 0.95rem)",
              }}
            >
              닉네임
              <EnLine style={{ fontSize: "0.78em", marginTop: 2, opacity: 0.9 }}>
                Nickname
              </EnLine>
            </label>
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="천상천하유아독존오네높"
              maxLength={20}
              autoComplete="nickname"
            />
            <p style={{ margin: 0, color: "#9a5c58", fontSize: 12, lineHeight: 1.4 }}>
              결과 화면에 함께 표시돼요. 캡처해 SNS에 올려보세요.
            </p>
          </div>

          <HomeShell>
            <HomeLeft>
              {CHARACTERS.map((c) => (
                <CharThumb
                  key={c.id}
                  type="button"
                  $active={c.id === selectedId}
                  onClick={() => setSelectedId(c.id)}
                >
                  <CharThumbImg
                    src={c.previewImageUrl ?? c.baseImageUrl}
                    alt={c.name}
                  />
                  <CharThumbLabel>{c.name}</CharThumbLabel>
                </CharThumb>
              ))}
            </HomeLeft>

            <HomeRight>
              {selected ? (
                <>
                  <PreviewFrame>
                    <PreviewImg
                      src={selected.previewImageUrl ?? selected.baseImageUrl}
                      alt={selected.name}
                    />
                  </PreviewFrame>
                  <HomeCTAButton
                    $primary
                    type="button"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1.2,
                    }}
                    onClick={() => {
                      try {
                        sessionStorage.setItem(
                          NICKNAME_STORAGE_KEY,
                          nickname.trim()
                        );
                      } catch {
                        // ignore
                      }
                      router.push(
                        `/play?characterId=${encodeURIComponent(selected.id)}`
                      );
                    }}
                  >
                    <BtnKoEn
                      ko="이 온꼬미즈로 꾸미기 →"
                      en="Dress up with this character →"
                    />
                  </HomeCTAButton>
                </>
              ) : null}
            </HomeRight>
          </HomeShell>
        </Container>
      </HomePage>
    </HomeAppBackground>
  );
}
