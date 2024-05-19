export function transformToNumber(str: string | number): string {
  if (String(str).length === 0 || isNaN(parseFloat(str as string))) {
    return '';
  }
  const number_formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2
  });
  return number_formatter.format(parseFloat(String(str)));
}

export function transformFromNumber(str: string): number | undefined {
  const _ = str.replace(/[^\d.-]/g,'');
  if (!_) {
    return undefined;
  }
  const _n = parseFloat(_);
  if (isNaN(_n)) {
    return undefined;
  }

  return _n;
}
