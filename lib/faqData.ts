import type { CategoryKey } from '@/config/constants';

export interface FaqEntry {
  id: string;
  category: CategoryKey;
  intent: string;
  representativeQuestion: string;
  similarExpressions: string[];
  /** 기존 FAQ 화면 호환용 표시 문구입니다. */
  question: string;
  answer: string;
}

// DEMO:
// 현재는 정적 FAQ 데이터를 Knowledge Source로 사용한다.
// 운영 버전에서는 관리자 업로드 문서 검색 결과(RAG Context)로 교체할 예정이다.
export const FAQ_ENTRIES: FaqEntry[] = [
  {
    id: 'start-test', category: 'guide', intent: '검사 시작 방법',
    representativeQuestion: '검사는 어떻게 시작하나요?', question: '검사는 어떻게 시작하나요?',
    similarExpressions: ['검사 시작하고 싶어요', '어디서 시작해요', '처음 어떻게 해요'],
    answer: '검사 안내를 받은 이메일이나 안내 메시지에서 검사 링크를 확인해 주세요. 링크를 열면 안내에 따라 검사를 시작할 수 있습니다. 검사 링크를 찾을 수 없다면 먼저 받은편지함과 스팸메일함을 확인해 주세요.',
  },
  {
    id: 'find-test-link', category: 'link', intent: '검사 링크 확인 위치',
    representativeQuestion: '검사 링크는 어디에서 확인하나요?', question: '검사 링크는 어디에서 확인하나요?',
    similarExpressions: ['링크 어디 있어요', '검사 주소 찾는 법', '접속 링크 확인'],
    answer: '검사 링크는 일반적으로 검사 안내 이메일이나 별도로 전달받은 안내 메시지에서 확인할 수 있습니다. 받은편지함에서 버크만 검사 관련 메일을 찾아보세요. 찾기 어렵다면 스팸메일함이나 프로모션함도 함께 확인해 주세요.',
  },
  {
    id: 'email-not-received', category: 'link', intent: '검사 안내 메일 미수신',
    representativeQuestion: '검사 안내 메일이 오지 않았어요.', question: '검사 안내 메일이 오지 않았어요.',
    similarExpressions: ['메일 안옴', '검사메일 못받음', '버크만 링크가 안왔는데', '메일이 없어요'],
    answer: '먼저 스팸메일함, 광고메일함, 프로모션함 등을 확인해 주세요. 그래도 메일이 없다면 신청할 때 입력한 이메일 주소가 정확한지 확인해 주세요. 계속 확인되지 않는 경우에는 검사 담당자에게 문의해 주세요.',
  },
  {
    id: 'find-test-email', category: 'link', intent: '검사 메일 찾기',
    representativeQuestion: '검사 메일을 어디에서 찾아야 하나요?', question: '검사 메일을 어디에서 찾아야 하나요?',
    similarExpressions: ['메일함 어디 봐요', '검사 메일 찾는 법', '스팸함도 봐야 하나요'],
    answer: '이메일 받은편지함에서 버크만 또는 검사와 관련된 제목의 메일을 찾아보세요. 검색 기능을 이용하면 더 쉽게 찾을 수 있습니다. 받은편지함에 없다면 스팸메일함이나 기타 분류함도 확인해 주세요.',
  },
  {
    id: 'link-not-opening', category: 'link', intent: '검사 링크 접속 실패',
    representativeQuestion: '검사 링크가 열리지 않아요.', question: '검사 링크가 열리지 않아요.',
    similarExpressions: ['링크 안 열림', '접속이 안돼요', '눌러도 반응이 없어요'],
    answer: '먼저 인터넷 연결 상태를 확인한 뒤 링크를 다시 열어보세요. 링크를 직접 눌렀을 때 열리지 않는다면 브라우저를 종료했다가 다시 시도해 볼 수 있습니다. 계속 접속되지 않는 경우에는 오류 화면이나 메시지를 확인한 뒤 담당자에게 문의해 주세요.',
  },
  {
    id: 'test-error-message', category: 'error', intent: '검사 중 오류 메시지',
    representativeQuestion: '검사 중 오류 메시지가 나와요.', question: '검사 중 오류 메시지가 나와요.',
    similarExpressions: ['에러가 떠요', '오류 문구 나옴', '검사하다 오류'],
    answer: '우선 현재 화면에 표시된 오류 메시지를 확인해 주세요. 페이지를 새로고침하거나 다시 접속하면 해결되는 경우도 있습니다. 같은 오류가 반복되면 오류 메시지나 화면을 캡처한 뒤 담당자에게 문의해 주세요.',
  },
  {
    id: 'mobile-test', category: 'guide', intent: '휴대폰 검사 가능 여부',
    representativeQuestion: '휴대폰으로 검사할 수 있나요?', question: '휴대폰으로 검사할 수 있나요?',
    similarExpressions: ['모바일로 해도 돼요', '폰으로 검사 가능', '스마트폰 검사'],
    answer: '사용 중인 검사 시스템이 모바일 환경을 지원한다면 휴대폰에서도 진행할 수 있습니다. 다만 문항을 안정적으로 확인하고 응답하려면 화면이 충분히 크고 인터넷 연결이 안정적인 환경에서 검사하는 것이 좋습니다. 휴대폰에서 화면이 정상적으로 표시되지 않는다면 PC 환경을 이용해 주세요.',
  },
  {
    id: 'recommended-environment', category: 'guide', intent: '권장 기기와 브라우저',
    representativeQuestion: '어떤 기기나 브라우저로 검사하는 게 좋나요?', question: '어떤 기기나 브라우저로 검사하는 게 좋나요?',
    similarExpressions: ['권장 브라우저', '컴퓨터로 해야 하나요', '크롬으로 해야 해요'],
    answer: '화면이 충분히 크고 인터넷 연결이 안정적인 기기를 사용하는 것이 좋습니다. 브라우저에서 화면이 정상적으로 표시되고 버튼이 잘 작동하는 환경에서 진행해 주세요. 특정 기기나 브라우저에 문제가 있다면 다른 브라우저나 PC에서 다시 시도해 볼 수 있습니다.',
  },
  {
    id: 'screen-frozen', category: 'progress', intent: '검사 화면 멈춤',
    representativeQuestion: '검사하다가 화면이 멈췄어요.', question: '검사하다가 화면이 멈췄어요.',
    similarExpressions: ['화면 멈춤', '검사가 안 넘어가요', '페이지가 굳었어요'],
    answer: '잠시 기다린 후에도 화면이 움직이지 않는다면 인터넷 연결 상태를 먼저 확인해 주세요. 이후 페이지를 다시 불러오거나 검사 링크로 재접속해 보세요. 같은 문제가 반복된다면 현재 화면을 캡처한 뒤 담당자에게 문의해 주세요.',
  },
  {
    id: 'internet-disconnected', category: 'error', intent: '검사 중 인터넷 끊김',
    representativeQuestion: '검사 중 인터넷이 끊겼어요.', question: '검사 중 인터넷이 끊겼어요.',
    similarExpressions: ['와이파이 끊김', '검사하다 인터넷 나감', '연결이 끊어졌어요'],
    answer: '먼저 인터넷 연결을 복구한 뒤 검사 페이지에 다시 접속해 보세요. 이전 응답이 저장되어 있는지는 검사 시스템에 따라 다를 수 있으므로 임의로 처음부터 다시 시작하기보다는 먼저 재접속 상태를 확인하는 것이 좋습니다. 진행 상태가 확인되지 않는다면 담당자에게 문의해 주세요.',
  },
  {
    id: 'resume-test', category: 'progress', intent: '중단한 검사 이어하기',
    representativeQuestion: '검사를 중간에 종료했는데 이어서 할 수 있나요?', question: '검사를 중간에 종료했는데 이어서 할 수 있나요?',
    similarExpressions: ['중간에 껐어요', '이어서 검사 가능해요', '다시 처음부터 해야 해요'],
    answer: '검사 링크로 다시 접속해 이전 진행 상태가 유지되어 있는지 확인해 주세요. 이어서 진행할 수 있는지는 검사 시스템의 저장 방식에 따라 달라질 수 있습니다. 진행 상태가 확인되지 않거나 처음 화면으로 돌아간 경우에는 담당자에게 문의해 주세요.',
  },
  {
    id: 'reuse-test-link', category: 'link', intent: '검사 링크 재접속',
    representativeQuestion: '검사 링크를 다시 눌러도 되나요?', question: '검사 링크를 다시 눌러도 되나요?',
    similarExpressions: ['링크 다시 들어가도 돼요', '재접속해도 되나요', '같은 링크 또 눌러도 돼요'],
    answer: '검사가 정상적으로 완료되지 않은 상태라면 기존 안내에서 받은 검사 링크로 다시 접속해 볼 수 있습니다. 재접속했을 때 이전 진행 상태가 유지되는지 먼저 확인해 주세요. 이미 검사를 완료했다면 임의로 다시 검사하기보다 담당자의 안내를 따르는 것이 좋습니다.',
  },
  {
    id: 'how-to-answer', category: 'guide', intent: '검사 문항 응답 방법',
    representativeQuestion: '검사 문항에는 어떻게 답해야 하나요?', question: '검사 문항에는 어떻게 답해야 하나요?',
    similarExpressions: ['문항 답하는 법', '어떤 기준으로 체크해요', '검사 요령'],
    answer: '문항에는 다른 사람이 기대하는 모습보다 평소 자신의 모습에 가장 가깝게 답해 주세요. 너무 오래 고민해서 이상적인 답을 만들기보다는 자신에게 자연스럽게 해당한다고 느껴지는 쪽을 선택하는 것이 좋습니다. 특정한 정답을 맞히는 검사는 아닙니다.',
  },
  {
    id: 'no-correct-answer', category: 'guide', intent: '검사 정답 여부',
    representativeQuestion: '검사에 정답이 있나요?', question: '검사에 정답이 있나요?',
    similarExpressions: ['맞는 답이 뭐예요', '틀린 답도 있나요', '정답 알려줘'],
    answer: '버크만 검사는 지식시험처럼 정답과 오답을 맞히는 방식의 검사가 아닙니다. 자신의 평소 모습과 생각을 솔직하게 표현하는 것이 중요합니다. 좋은 답을 찾으려고 하기보다 자신에게 더 가까운 응답을 선택해 주세요.',
  },
  {
    id: 'answer-for-good-result', category: 'guide', intent: '좋은 결과를 위한 응답 요구',
    representativeQuestion: '좋은 결과를 받으려면 어떻게 답해야 하나요?', question: '좋은 결과를 받으려면 어떻게 답해야 하나요?',
    similarExpressions: ['유리하게 답하는 법', '취업에 좋은 답', '좋은 유형 나오게 해줘'],
    answer: '특정한 방향으로 답한다고 해서 더 좋은 결과가 되는 것은 아닙니다. 검사 결과를 좋게 만들려고 응답하기보다 평소 자신의 모습을 기준으로 솔직하게 답하는 것이 중요합니다. 그래야 이후 결과를 이해하고 활용하는 데에도 도움이 됩니다.',
  },
  {
    id: 'current-or-ideal-self', category: 'guide', intent: '현재 모습과 이상적 모습 중 응답 기준',
    representativeQuestion: '현재 모습과 되고 싶은 모습 중 어떤 기준으로 답하나요?', question: '현재 모습과 되고 싶은 모습 중 어떤 기준으로 답하나요?',
    similarExpressions: ['지금 모습으로 답해요', '되고 싶은 모습으로 체크해요', '현재와 이상 중 기준'],
    answer: '되고 싶은 모습이나 이상적인 모습을 만들기보다는 현재 평소의 자신에게 더 가까운 쪽을 기준으로 답해 주세요. “나는 이렇게 보여야 한다”보다는 “나는 실제로 어떤 편인가”를 생각하면 선택하기 쉽습니다. 특정 상황에서만 나타나는 모습보다 평소 반복적으로 나타나는 모습을 기준으로 판단해 보세요.',
  },
  {
    id: 'work-or-everyday-self', category: 'guide', intent: '직장과 평소 모습이 다를 때 응답 기준',
    representativeQuestion: '직장과 평소 모습이 다른데 어떻게 답하나요?', question: '직장과 평소 모습이 다른데 어떻게 답하나요?',
    similarExpressions: ['회사에서랑 집에서 달라요', '업무 모습으로 답해요', '어느 상황 기준이에요'],
    answer: '상황에 따라 행동이 달라지는 것은 자연스러운 일입니다. 한 가지 특정 상황에만 맞추기보다는 여러 상황을 생각했을 때 평소 자신에게 더 가깝다고 느껴지는 쪽을 선택해 주세요. 너무 예외적인 상황보다는 반복적으로 나타나는 자신의 모습을 떠올려 보는 것이 좋습니다.',
  },
  {
    id: 'question-meaning-unclear', category: 'guide', intent: '검사 문항 의미 확인',
    representativeQuestion: '문항의 뜻을 모르겠어요.', question: '문항의 뜻을 모르겠어요.',
    similarExpressions: ['질문이 이해 안돼요', '문장 뜻 알려줘', '이 문항 무슨 말이에요'],
    answer: '문항을 천천히 다시 읽고 각 표현이 일상적인 의미에서 무엇을 묻는지 생각해 보세요. 특정 답을 골라야 한다고 생각하기보다는 문장의 의미를 이해한 뒤 자신의 모습에 가까운 쪽을 선택하면 됩니다. 문장 자체가 이해되지 않는다면 문항 내용을 질문해 주세요. 의미는 설명할 수 있지만 어떤 답을 선택해야 하는지는 대신 결정하지 않습니다.',
  },
  {
    id: 'choosing-between-answers', category: 'guide', intent: '두 응답 사이에서 고민',
    representativeQuestion: '두 답변 사이에서 고민될 때 어떻게 하나요?', question: '두 답변 사이에서 고민될 때 어떻게 하나요?',
    similarExpressions: ['둘 중 뭐 골라요', '두 개 다 비슷해요', '선택을 못하겠어요'],
    answer: '두 선택지가 모두 자신에게 해당하는 것처럼 느껴질 수 있습니다. 이럴 때는 평소 더 자주 나타나는 모습이나 자신에게 조금 더 자연스럽다고 느껴지는 쪽을 선택해 보세요. 완벽하게 맞는 답을 찾으려고 너무 오래 고민할 필요는 없습니다.',
  },
  {
    id: 'repeated-questions', category: 'guide', intent: '유사 문항 반복 여부',
    representativeQuestion: '비슷한 질문이 계속 나오는데 정상인가요?', question: '비슷한 질문이 계속 나오는데 정상인가요?',
    similarExpressions: ['같은 질문이 반복돼요', '왜 비슷한 문항이 많아요', '중복 질문 정상이에요'],
    answer: '검사를 진행하다 보면 비슷하게 느껴지는 표현이나 문항이 나타날 수 있습니다. 이전에 어떤 답을 선택했는지 맞추려고 하기보다는 각 문항을 개별적으로 읽고 그 순간 자신의 평소 모습에 맞게 답해 주세요. 문항이 반복된다고 느껴져도 의도적으로 답을 맞추려 하지 않는 것이 좋습니다.',
  },
];
