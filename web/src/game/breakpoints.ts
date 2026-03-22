/**
 * 가로 이상이면 “PC 전용” 안내 화면만 표시 (앱 숨김).
 * 태블릿·아이패드 가로(대략 1366px 이하)는 앱 허용.
 *
 * `app/globals.css` 의 `.dressup-desktop-gate` 미디어쿼리와 값을 맞출 것.
 */
export const DESKTOP_ONLY_MIN_WIDTH_PX = 1400;
