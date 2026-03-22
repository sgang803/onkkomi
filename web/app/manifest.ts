import type { MetadataRoute } from "next";

/** 모바일 "홈 화면에 추가" 시 기본 메타 (아이콘은 추후 public/icon-192.png 등 추가 권장) */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "온꼬미즈 꾸미기",
    short_name: "온꼬미즈",
    description: "온꼬미즈를 드래그로 꾸미기",
    start_url: "/",
    display: "standalone",
    background_color: "#e8eaf0",
    theme_color: "#e8eaf0",
    lang: "ko",
    orientation: "portrait-primary",
  };
}
