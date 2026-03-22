import Link from "next/link";

/** 존재하지 않는 경로 — PC 전용 게이트보다 우선 표시 (globals.css `:has(.dressup-not-found)`) */
export default function NotFound() {
  return (
    <div className="dressup-not-found">
      <h1 className="dressup-not-found__code">404</h1>
      <p className="dressup-not-found__lead">페이지를 찾을 수 없어요</p>
      <p className="dressup-not-found__hint">
        주소가 잘못되었거나 삭제된 페이지예요.
      </p>

      <div className="dressup-not-found__video-wrap">
        <iframe
          src="https://www.youtube.com/embed/xkY2aC-HnPA"
          title="온꼬미즈 관련 영상"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <Link href="/" className="dressup-not-found__home">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
