import { CounselingRecord } from '@/lib/records';
import { branchTagClass } from './branchTag';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function RecordRow({ record, onClick }: { record: CounselingRecord; onClick: () => void }) {
  return (
    <div className="record-row" onClick={onClick}>
      <div className="num">{formatDate(record.record_date)}</div>
      <div className="rc-phone num">•••-{record.phone_last4}</div>
      <div className="rc-topic">
        {record.topic}
        {record.topic_detail && <span>{record.topic_detail}</span>}
      </div>
      <div>
        <span className={branchTagClass(record.branch)}>
          {record.branch} · {record.rank}
        </span>
      </div>
      <div>{record.method}</div>
      <div>
        <span className={`status-dot ${record.status === 'done' ? 'status-done' : 'status-draft'}`}>
          {record.status === 'done' ? '작성완료' : '임시저장'}
        </span>
      </div>
    </div>
  );
}
