import type { CSSProperties, ReactNode } from "react";

const enLineBase: CSSProperties = {
  display: "block",
  fontSize: "clamp(0.65rem, 2.6vw, 0.78rem)",
  fontWeight: 500,
  opacity: 0.88,
  marginTop: 4,
  lineHeight: 1.35,
  letterSpacing: "0.02em",
};

const btnEnBase: CSSProperties = {
  display: "block",
  fontSize: "clamp(0.55rem, 2.2vw, 0.68rem)",
  fontWeight: 600,
  opacity: 0.92,
  marginTop: 3,
  lineHeight: 1.25,
  letterSpacing: "0.02em",
};

/** 한글 제목·문단 아래에 붙이는 작은 영어 한 줄 */
export function EnLine({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <span lang="en" style={{ ...enLineBase, ...style }}>
      {children}
    </span>
  );
}

/** 버튼 안: 위 한글 · 아래 영어 (부모 버튼에 `display:flex; flexDirection:column; alignItems:center` 권장) */
export function BtnKoEn({ ko, en }: { ko: string; en: string }) {
  return (
    <>
      <span style={{ display: "block" }}>{ko}</span>
      <span lang="en" style={btnEnBase}>
        {en}
      </span>
    </>
  );
}
