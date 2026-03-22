import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 14px;
  padding-top: max(12px, env(safe-area-inset-top));
  padding-left: max(14px, env(safe-area-inset-left));
  padding-right: max(14px, env(safe-area-inset-right));
  padding-bottom: max(12px, env(safe-area-inset-bottom));
  gap: 12px;

  @media (min-width: 769px) {
    padding: 24px;
    gap: 16px;
  }
`;

export const Container = styled.div`
  width: 100%;
  max-width: 980px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 769px) {
    gap: 16px;
  }
`;

export const Row = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

export const Title = styled.h1`
  font-size: clamp(1.15rem, 4vw, 1.5rem);
  font-weight: 700;
`;

export const Subtitle = styled.p`
  color: #555;
  line-height: 1.4;
  font-size: clamp(0.85rem, 3.2vw, 1rem);
`;

export const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(6px);
  padding: 16px;
`;

export const Button = styled.button<{ $primary?: boolean }>`
  appearance: none;
  border: none;
  border-radius: 12px;
  padding: 10px 14px;
  cursor: pointer;
  font-weight: 700;
  background: ${({ $primary }) => ($primary ? "#111" : "rgba(0, 0, 0, 0.08)")};
  color: ${({ $primary }) => ($primary ? "#fff" : "#111")};
  transition: transform 120ms ease, opacity 120ms ease;

  /* 터치 기기 권장 최소 탭 영역 (~44px) */
  @media (pointer: coarse) {
    min-height: 44px;
    padding: 12px 16px;
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Input = styled.input`
  width: 100%;
  max-width: 520px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.14);
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
`;

export const Small = styled.div`
  font-size: 12px;
  color: #666;
  line-height: 1.4;
`;

