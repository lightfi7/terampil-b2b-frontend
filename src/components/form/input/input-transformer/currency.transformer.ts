const currency_formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function transformToCurrency(str: string | number): string {
  if (!str || isNaN(parseInt(str as string))) {
    return 'Rp 0';
  }
  return currency_formatter.format(parseInt(String(str)));
}

export function transformFromCurrency(str: string): number | undefined {
  const _ = str.replace(/\D|\./g,'');
  if (!_) {
    return undefined;
  }
  const _n = parseInt(_);
  if (isNaN(_n)) {
    return undefined;
  }

  return _n;
}
