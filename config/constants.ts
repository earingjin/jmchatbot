export const SERVICE_NAME = '버크만 검사 24시 AI 도움센터';

export const SUPPORT_PHONE = '02-000-0000';
export const SUPPORT_HOURS_TEXT = '평일 09:00~18:00';
export const ESCALATION_MESSAGE = `${SUPPORT_HOURS_TEXT}에 전화 연결이 가능합니다. 📞 ${SUPPORT_PHONE}`;

export const CATEGORIES = [
  { key: 'guide', label: '검사 방법을 모르겠어요' },
  { key: 'link', label: '검사 링크/로그인이 안 돼요' },
  { key: 'progress', label: '검사가 진행되지 않아요' },
  { key: 'error', label: '검사 중 오류가 발생했어요' },
  { key: 'result', label: '결과 확인이 안 돼요' },
  { key: 'etc', label: '기타 문의' },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]['key'];

// Leaf-level issue tags used for the admin "TOP 10 문의" ranking.
// Kept as a fixed, small controlled vocabulary rather than a DB table —
// the list changes rarely and the chatbot only ever assigns one of these.
export const TOPICS = [
  'link_blank_screen',
  'link_expired',
  'link_no_response',
  'auth_otp_not_received',
  'auth_otp_error',
  'password_reset',
  'start_button_disabled',
  'next_button_disabled',
  'screen_frozen',
  'test_interrupted',
  'mobile_issue',
  'pc_issue',
  'result_not_visible',
  'completion_unclear',
  'how_to_start',
  'other',
] as const;

export type TopicKey = (typeof TOPICS)[number];
