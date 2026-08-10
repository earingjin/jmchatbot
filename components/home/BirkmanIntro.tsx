import { ReviewBoard } from './ReviewBoard';

const COMPONENTS = [
  ['01', 'USUAL BEHAVIOR', '평소 행동', '평상시 타인에게 보이는 사회적 스타일과 강점'],
  ['02', 'NEEDS', '내면의 욕구', '행동의 동기가 되며 만족되어야 하는 심리적 요구'],
  ['03', 'STRESS BEHAVIOR', '스트레스 행동', '욕구가 충족되지 않을 때 나타나는 부정적 반응'],
  ['04', 'INTERESTS', '흥미', '좋아하는 활동이나 직무 성향'],
];

export function BirkmanIntro() {
  return (
    <section className="birkman-intro" aria-labelledby="birkman-intro-title">
      <div className="birkman-intro-copy">
        <span className="section-eyebrow">BIRKMAN METHOD</span>
        <h2 id="birkman-intro-title">버크만 진단 소개</h2>
        <h3>버크만 메소드 <span>(The Birkman Method)</span></h3>
        <p>사람의 행동은 선천적인 기질과 환경에 의해 작용됩니다.</p>
        <p>
          버크만 메소드는 개인과 대인관계에 영향을 미치는 다양한 관점, 행동, 동기에 영향을 미치는
          특성을 측정하는 도구로서, 각 개인에게 적합한 스트레스 상황에 대처하는 유용한 방법, 다른
          사람들과의 관계와 상호작용의 큰 그림을 보는 데 도움을 줍니다.
        </p>
      </div>

      <div className="concept-diagram concept-image-frame">
        <iframe
          className="concept-image"
          src="https://www.youtube.com/embed/u2t1pjDKZ18?autoplay=1&mute=1&loop=1&playlist=u2t1pjDKZ18&controls=1"
          title="버크만 진단 소개 영상"
          style={{ width: '100%', height: '100%', border: 0 }}
          allow="autoplay; encrypted-media"
        />
      </div>

      <ReviewBoard />

      <div className="birkman-detail-groups">
        <section className="birkman-detail-section" aria-labelledby="components-title">
          <div className="detail-heading"><span>01</span><h3 id="components-title">구성 요소</h3></div>
          <div className="components-grid">
            {COMPONENTS.map(([number, english, title, description]) => (
              <article className="component-item" key={number}>
                <span className="component-number">{number}</span>
                <small>{english}</small>
                <h4>{title}</h4>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="birkman-detail-section" aria-labelledby="use-cases-title">
          <div className="detail-heading"><span>02</span><h3 id="use-cases-title">활용 분야</h3></div>
          <div className="use-cases-grid">
            <article className="use-case-item">
              <header><span>01</span><small>SELF</small><h4>겉모습과 속마음의 차이 파악</h4></header>
              <InfoList items={[
                ['평소 행동 · 강점', '타인에게 비치는 나의 업무 스타일과 강점을 파악합니다.'],
                ['평소 욕구 · 동기', '일할 때 충족되어야 하는 환경과 대우를 이해합니다.'],
                ['스트레스 행동', '욕구가 좌절될 때 나타나는 반응을 살펴봅니다.'],
              ]} />
            </article>
            <article className="use-case-item">
              <header><span>02</span><small>CAREER</small><h4>커리어 및 직무 적합성 탐색</h4></header>
              <InfoList items={[
                ['활동 유형 · 흥미', '내가 좋아하고 자연스럽게 몰입하는 활동을 발견합니다.'],
                ['직무 및 직업군', '나의 성향에 잘 맞는 직무와 직업군을 확인합니다.'],
                ['업무 방향성', '효율적으로 일하며 에너지를 아끼는 방향을 설정합니다.'],
              ]} />
            </article>
            <article className="use-case-item">
              <header><span>03</span><small>RELATIONSHIP</small><h4>대인관계 및 조직 소통 개선</h4></header>
              <InfoList items={[
                ['행동 이면의 욕구', '동료와 팀원의 행동 뒤에 있는 진짜 욕구를 이해합니다.'],
                ['갈등 예방 · 협업', '서로의 차이를 이해해 갈등을 줄이고 협업을 돕습니다.'],
                ['리더십 · 팀 관리', '리더십 스타일을 점검하고 팀 관리 능력을 높입니다.'],
              ]} />
            </article>
          </div>
        </section>
      </div>
    </section>
  );
}

function ConceptCard({
  tone,
  icon,
  label,
  title,
  description,
}: {
  tone: 'coral' | 'mint';
  icon: 'person' | 'environment' | 'observable' | 'motivation';
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className={`concept-card concept-card-${tone}`}>
      <span className="concept-icon" aria-hidden="true"><ConceptIcon type={icon} /></span>
      <span className="concept-card-copy">
        <small>{label}</small>
        <strong>{title}</strong>
        {description && <span>{description}</span>}
      </span>
    </div>
  );
}

function ConceptIcon({ type }: { type: 'person' | 'environment' | 'observable' | 'motivation' }) {
  if (type === 'person') return <svg viewBox="0 0 48 48"><circle cx="24" cy="15" r="8"/><path d="M11 39c1-9 6-14 13-14s12 5 13 14"/></svg>;
  if (type === 'environment') return <svg viewBox="0 0 48 48"><circle cx="17" cy="14" r="7"/><circle cx="31" cy="18" r="6"/><path d="M6 38c1-10 5-16 11-16s10 5 11 13M26 37c1-7 4-11 9-11 3 0 5 1 7 4"/><path d="M31 39c8-1 12-6 12-13-7 0-12 4-12 13Zm0 0 8-9"/></svg>;
  if (type === 'observable') return <svg viewBox="0 0 48 48"><path d="M5 21s7-10 19-10 19 10 19 10-7 10-19 10S5 21 5 21Z"/><circle cx="24" cy="21" r="6"/><path d="M14 39h8m-8-5h5m17 7-4-7-4 7m4-7v-7"/></svg>;
  return <svg viewBox="0 0 48 48"><path d="M24 39S8 30 8 17c0-8 10-11 16-3 6-8 16-5 16 3 0 13-16 22-16 22Z"/><path d="M20 21h8m-4-4v8m-5 8c3-4 7-4 10 0"/></svg>;
}

function InfoList({ items }: { items: string[][] }) {
  return <div className="info-list">{items.map(([title, description], index) => (
    <div className="info-row" key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{title}</strong><p>{description}</p></div></div>
  ))}</div>;
}
