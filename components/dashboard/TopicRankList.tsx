export function TopicRankList({ topics }: { topics: { topic: string; count: number }[] }) {
  return (
    <section>
      <h2 style={{ fontSize: 16, marginBottom: 10 }}>TOP 10 문의</h2>
      {topics.length === 0 ? (
        <p style={{ color: '#999', fontSize: 13 }}>아직 데이터가 없습니다.</p>
      ) : (
        <ol style={{ paddingLeft: 20, margin: 0 }}>
          {topics.map((t) => (
            <li key={t.topic} style={{ marginBottom: 4, fontSize: 14 }}>
              {t.topic} <span style={{ color: '#999' }}>({t.count}건)</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
