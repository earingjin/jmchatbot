export function branchTagClass(branch: string): string {
  switch (branch) {
    case '육군':
      return 'tag tag-army';
    case '해군':
      return 'tag tag-navy';
    case '공군':
      return 'tag tag-airforce';
    default:
      return 'tag tag-etc';
  }
}
