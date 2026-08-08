export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 10, padding: '14px 16px' }}>
      <p style={{ margin: 0, fontSize: 12, color: '#666' }}>{label}</p>
      <p style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 700 }}>{value}</p>
    </div>
  );
}
