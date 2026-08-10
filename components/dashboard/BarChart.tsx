export function BarChart({ bars }: { bars: { label: string; reserved: number; progressed: number }[] }) {
  const maxVal = Math.max(...bars.map((b) => Math.max(b.reserved, b.progressed))) * 1.15;

  return (
    <div className="bar-chart">
      {bars.map((b) => {
        const rH = Math.round((b.reserved / maxVal) * 140);
        const pH = Math.round((b.progressed / maxVal) * 140);
        return (
          <div className="bar-group" key={b.label}>
            <div className="bar-stack">
              <div className="bar reserved" style={{ height: rH }}>
                <span className="bar-val">{b.reserved}</span>
              </div>
              <div className="bar progressed" style={{ height: pH }}>
                <span className="bar-val">{b.progressed}</span>
              </div>
            </div>
            <div className="bar-group-label">{b.label}</div>
          </div>
        );
      })}
    </div>
  );
}
