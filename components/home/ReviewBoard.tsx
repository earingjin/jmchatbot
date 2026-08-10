export function ReviewBoard() {
  return (
    <section className="review-board" aria-labelledby="review-board-title">
      <div className="review-board-copy">
        <span className="section-eyebrow">REVIEW</span>
        <h2 id="review-board-title">여러분의 이야기를 들려주세요</h2>
        <p>자유롭게 후기와 응원의 한마디를 남겨주세요.</p>
      </div>
      <div
        className="padlet-embed"
        style={{
          border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: 16,
          boxSizing: 'border-box',
          overflow: 'hidden',
          position: 'relative',
          width: '100%',
          background: '#F4F4F4',
        }}
      >
        <iframe
          src="https://padlet.com/embed/287xzictk0rap3tc"
          frameBorder={0}
          allow="camera;microphone;geolocation;display-capture;clipboard-write"
          style={{ width: '100%', height: '608px', display: 'block', border: 0 }}
          title="사용자 리뷰 게시판"
        />
      </div>
    </section>
  );
}
