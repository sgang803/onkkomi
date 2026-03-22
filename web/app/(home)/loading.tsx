export default function HomeLoading() {
  return (
    <div className="dressup-home-loading">
      <div className="dressup-home-loading__inner" role="status" aria-live="polite">
        <div className="dressup-spinner" aria-hidden />
        <p className="dressup-home-loading__text">불러오는 중…</p>
      </div>
    </div>
  );
}
