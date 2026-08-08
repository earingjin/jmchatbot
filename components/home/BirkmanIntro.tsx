export function BirkmanIntro() {
  return (
    <section className="birkman-intro" aria-labelledby="birkman-intro-title">
      <div className="birkman-intro-copy">
        <span className="section-eyebrow">BIRKMAN METHOD</span>
        <h2 id="birkman-intro-title">버크만 진단 소개</h2>
        <h3>버크만 메소드 <span>(The Birkman Method)</span></h3>
        <p>
          사람의 행동은 선천적인 기질과 환경에 의해 작용됩니다.
        </p>
        <p>
          버크만 메소드는 개인과 대인관계에 영향을 미치는 다양한 관점, 행동, 동기에 영향을 미치는
          특성을 측정하는 도구로서, 각 개인에게 적합한 스트레스 상황에 대처하는 유용한 방법, 다른
          사람들과의 관계와 상호작용의 큰 그림을 보는 데 도움을 줍니다.
        </p>
      </div>

      <div className="birkman-tree-card">
        <p className="tree-formula">Behavior = ƒ (Person / Environment)</p>
        <div className="tree-visual" aria-hidden="true">
          <div className="tree-crown">
            <span className="leaf leaf-1" /><span className="leaf leaf-2" />
            <span className="leaf leaf-3" /><span className="leaf leaf-4" />
            <span className="leaf leaf-5" />
          </div>
          <div className="tree-trunk" />
          <div className="tree-ground">
            <span className="root root-1" /><span className="root root-2" />
            <span className="root root-3" /><span className="root root-4" />
          </div>
        </div>
        <div className="tree-divider" />
        <div className="tree-label tree-label-top">
          <strong>겉으로 관찰되는 행동</strong>
          <span>긍정행동 · 스트레스행동</span>
        </div>
        <div className="tree-label tree-label-bottom">
          <strong>겉으로 관찰할 수 없는 영역</strong>
          <span>동기와 욕구 · 행동의 원인 · 흥미와 적성</span>
        </div>
      </div>

      <div className="birkman-detail-groups">
        <section className="birkman-detail-section" aria-labelledby="components-title">
          <div className="detail-heading">
            <span>01</span>
            <h3 id="components-title">구성 요소</h3>
          </div>
          <div className="detail-card-grid components-grid">
            <article className="detail-card">
              <h4><span className="card-title-icon" aria-hidden="true">👤</span><span>평소 행동 <small>Usual Behavior</small></span></h4>
              <p>평상시 타인에게 보이는 사회적 스타일과 강점</p>
            </article>
            <article className="detail-card">
              <h4><span className="card-title-icon" aria-hidden="true">💭</span><span>내면의 욕구 <small>Needs</small></span></h4>
              <p>행동의 동기가 되며 만족되어야 하는 심리적 요구</p>
            </article>
            <article className="detail-card">
              <h4><span className="card-title-icon" aria-hidden="true">⚡</span><span>스트레스 행동 <small>Stress Behavior</small></span></h4>
              <p>욕구가 충족되지 않을 때 나타나는 부정적 반응</p>
            </article>
            <article className="detail-card">
              <h4><span className="card-title-icon" aria-hidden="true">✨</span><span>흥미 <small>Interests</small></span></h4>
              <p>좋아하는 활동이나 직무 성향</p>
            </article>
          </div>
        </section>

        <section className="birkman-detail-section" aria-labelledby="use-cases-title">
          <div className="detail-heading">
            <span>02</span>
            <h3 id="use-cases-title">활용 분야</h3>
          </div>
          <div className="detail-card-grid use-cases-grid">
            <article className="detail-card">
              <h4><span className="card-title-icon" aria-hidden="true">🔍</span><span>겉모습과 속마음의 차이 파악</span></h4>
              <div className="info-list">
                <div className="info-row"><span>01</span><div><strong>평소 행동 · 강점</strong><p>타인에게 비치는 나의 업무 스타일과 강점을 파악합니다.</p></div></div>
                <div className="info-row"><span>02</span><div><strong>평소 욕구 · 동기</strong><p>일할 때 충족되어야 하는 환경과 대우를 이해합니다.</p></div></div>
                <div className="info-row"><span>03</span><div><strong>스트레스 행동</strong><p>욕구가 좌절될 때 나타나는 반응을 살펴봅니다.</p></div></div>
              </div>
            </article>
            <article className="detail-card">
              <h4><span className="card-title-icon" aria-hidden="true">🧭</span><span>커리어 및 직무 적합성 탐색</span></h4>
              <div className="info-list">
                <div className="info-row"><span>01</span><div><strong>활동 유형 · 흥미</strong><p>내가 좋아하고 자연스럽게 몰입하는 활동을 발견합니다.</p></div></div>
                <div className="info-row"><span>02</span><div><strong>직무 및 직업군</strong><p>나의 성향에 잘 맞는 직무와 직업군을 확인합니다.</p></div></div>
                <div className="info-row"><span>03</span><div><strong>업무 방향성</strong><p>효율적으로 일하며 에너지를 아끼는 방향을 설정합니다.</p></div></div>
              </div>
            </article>
            <article className="detail-card">
              <h4><span className="card-title-icon" aria-hidden="true">🤝</span><span>대인관계 및 조직 소통 개선</span></h4>
              <div className="info-list">
                <div className="info-row"><span>01</span><div><strong>행동 이면의 욕구</strong><p>동료와 팀원의 행동 뒤에 있는 진짜 욕구를 이해합니다.</p></div></div>
                <div className="info-row"><span>02</span><div><strong>갈등 예방 · 협업</strong><p>서로의 차이를 이해해 갈등을 줄이고 협업을 돕습니다.</p></div></div>
                <div className="info-row"><span>03</span><div><strong>리더십 · 팀 관리</strong><p>리더십 스타일을 점검하고 팀 관리 능력을 높입니다.</p></div></div>
              </div>
            </article>
          </div>
        </section>

      </div>
    </section>
  );
}
