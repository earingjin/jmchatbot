import { CATEGORIES } from '@/config/constants';

export function CategoryBarChart({ counts }: { counts: Record<string, number> }) {
  const max = Math.max(1, ...Object.values(counts));

  return (
    <section style={{ marginBottom: 20 }}>
      <h2 style={{ fontSize: 16, marginBottom: 10 }}>카테고리별 문의</h2>
      {CATEGORIES.map((c) => {
        const count = counts[c.key] ?? 0;
        return (
          <div key={c.key} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 2 }}>
              <span>{c.label}</span>
              <span>{count}건</span>
            </div>
            <div style={{ height: 8, background: '#e5e7eb', borderRadius: 4 }}>
              <div
                style={{
                  height: 8,
                  width: `${(count / max) * 100}%`,
                  background: '#2563eb',
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
        );
      })}
    </section>
  );
}
