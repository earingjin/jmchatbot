const PHONE_RE = /\b0\d{1,2}[-.\s]?\d{3,4}[-.\s]?\d{4}\b/g;
const EMAIL_RE = /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g;
const RRN_RE = /\b\d{6}[-\s]?\d{7}\b/g; // 주민등록번호 형식

/**
 * Masks phone numbers, emails, and resident-registration-number patterns
 * before text is either sent to the LLM or persisted — this app collects
 * no identity by design, so anything that looks like PII is redacted
 * rather than stored or forwarded.
 */
export function maskPII(text: string): string {
  return text
    .replace(RRN_RE, '[가려짐]')
    .replace(PHONE_RE, '[가려짐]')
    .replace(EMAIL_RE, '[가려짐]');
}
