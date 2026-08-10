import Link from 'next/link';

const ACCOUNTS = [
  { name: '김상담', id: 'counselor_kim', center: '서울센터', perm: '상담사', permClass: 'perm-counselor' },
  { name: '이지원', id: 'counselor_lee', center: '대전센터', perm: '상담사', permClass: 'perm-counselor' },
  { name: '박훈련', id: 'counselor_park', center: '부산센터', perm: '상담사', permClass: 'perm-counselor' },
  { name: '교육담당자', id: 'admin_jm', center: '본사', perm: '관리자', permClass: 'perm-admin' },
  { name: '국방교육담당자', id: 'defense_dept', center: '국방부', perm: '국방교육담당자(읽기전용)', permClass: 'perm-counselor' },
];

export function AccountCreate() {
  return (
    <div className="cns-page">
      <Link href="/admin/dashboard" className="back-link">← 대시보드로</Link>
      <div className="page-head">
        <div>
          <div className="eyebrow">계정 관리</div>
          <h1>상담사 계정 생성</h1>
          <p className="page-sub">신규 상담사 계정을 발급하고 권한을 지정합니다.</p>
        </div>
      </div>

      <div className="card">
        <div className="grid-2">
          <div className="field">
            <label>이름</label>
            <input type="text" placeholder="예: 정수현" />
          </div>
          <div className="field">
            <label>아이디</label>
            <input type="text" placeholder="예: counselor_jung" />
          </div>
          <div className="field">
            <label>초기 비밀번호</label>
            <input type="text" placeholder="자동 생성 또는 직접 입력" defaultValue="jm-temp-8823" />
          </div>
          <div className="field">
            <label>권한</label>
            <select>
              <option>상담사</option>
              <option>교육담당자(관리자)</option>
            </select>
          </div>
          <div className="field">
            <label>소속 센터</label>
            <input type="text" placeholder="예: 서울센터" defaultValue="서울센터" />
          </div>
          <div className="field">
            <label>연락처</label>
            <input type="text" placeholder="010-0000-0000" />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-outline">취소</button>
          <button className="btn btn-brass">계정 생성</button>
        </div>
      </div>

      <div className="account-table-wrap">
        <div className="panel-title" style={{ marginBottom: 14 }}>
          등록된 계정
        </div>
        <table className="counselor-table">
          <thead>
            <tr>
              <th>이름</th>
              <th>아이디</th>
              <th>소속 센터</th>
              <th>권한</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {ACCOUNTS.map((a) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>
                  <span className="id-pill">{a.id}</span>
                </td>
                <td>{a.center}</td>
                <td>
                  <span className={`perm-badge ${a.permClass}`}>{a.perm}</span>
                </td>
                <td>
                  <span className="status-dot status-done">활성</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
