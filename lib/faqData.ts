import type { CategoryKey } from '@/config/constants';

export interface FaqEntry {
  category: CategoryKey;
  question: string;
  answer: string;
}

export const FAQ_ENTRIES: FaqEntry[] = [
  {
    category: 'link',
    question: '검사 링크를 눌렀는데 화면이 하얗게 나와요.',
    answer: '브라우저를 새로고침(F5)해보세요. 안 되면 다른 브라우저(Chrome/Safari)로 다시 열어보세요.',
  },
  {
    category: 'link',
    question: '링크가 만료됐다는 메시지가 나와요.',
    answer: '링크는 발송일로부터 일정 기간만 유효합니다. 문자로 받은 링크가 맞는지, 유효기간이 지나지 않았는지 확인해주세요. 재발급이 필요하면 상담사 연결을 이용해주세요.',
  },
  {
    category: 'link',
    question: '링크를 눌러도 아무 반응이 없어요.',
    answer: '인터넷 연결 상태와 팝업 차단 설정을 확인해주세요. 팝업이 차단돼 있으면 새 창이 열리지 않을 수 있습니다.',
  },
  {
    category: 'link',
    question: '본인인증 번호가 오지 않아요.',
    answer: '휴대폰 번호를 정확히 입력했는지, 문자가 스팸함으로 가지 않았는지 확인해주세요.',
  },
  {
    category: 'link',
    question: '비밀번호를 잊어버렸어요.',
    answer: '로그인 화면의 비밀번호 재설정 절차를 이용해주세요. 계속 안 되면 상담사 연결을 이용해주세요.',
  },
  {
    category: 'progress',
    question: '검사 시작 버튼이 눌러지지 않아요.',
    answer: '본인인증/안내문 확인 체크박스를 모두 체크했는지 확인 후 새로고침해보세요.',
  },
  {
    category: 'progress',
    question: '문항에 응답했는데 다음으로 넘어가지 않아요.',
    answer: '화면을 위아래로 스크롤해서 응답하지 않은 문항(필수 표시 *)이 남아있는지 확인해주세요.',
  },
  {
    category: 'progress',
    question: '화면이 그대로 멈춰있어요.',
    answer: '인터넷 연결을 확인하고 새로고침해보세요. 진행 상황이 자동 저장되지 않을 수 있습니다.',
  },
  {
    category: 'error',
    question: '검사 중간에 갑자기 종료됐어요.',
    answer: '같은 링크로 재접속해서 재개할 수 있는지 확인해주세요. 안 되면 상담사 연결을 이용해주세요.',
  },
  {
    category: 'error',
    question: '모바일에서 화면이 이상하게 보여요.',
    answer: '모바일 브라우저를 최신 버전으로 업데이트하거나, 가능하면 PC로 접속해보세요.',
  },
  {
    category: 'result',
    question: '검사를 완료했는지 잘 모르겠어요.',
    answer: '검사 완료 화면(완료 메시지)까지 보셨다면 완료된 것입니다. 못 보셨다면 검사 사이트에 다시 로그인해서 진행 상태를 확인해주세요.',
  },
  {
    category: 'result',
    question: '결과가 안 보여요.',
    answer: '결과는 안내받은 시점(예: 검사 완료 후 일정 기간 이내)에 검사 사이트 로그인 후 확인할 수 있습니다.',
  },
  {
    category: 'guide',
    question: '검사는 얼마나 걸리나요?',
    answer: '약 30~40분이 소요됩니다.',
  },
  {
    category: 'guide',
    question: '검사를 다시 할 수 있나요?',
    answer: '재응시가 필요한 경우 상담사 연결을 통해 문의해주세요.',
  },
];
