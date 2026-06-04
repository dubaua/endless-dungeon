export default function isBadPattern(pattern: string): boolean {
  const hasThreeSnares = /.*s-s-s.*/.test(pattern);
  const isComb = /.-.-.-.-.-.-.-.-/.test(pattern);
  return hasThreeSnares && !isComb;
}
