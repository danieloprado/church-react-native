export function phoneFormatter(value: string): string {
  if (!value) return value;

  const regexp = value.length > 10 ?
    /^(\d{0,2})(\d{0,5})(\d{0,4}).*/ :
    /^(\d{0,2})(\d{0,4})(\d{0,4}).*/;

  return value.replace(regexp, '($1) $2-$3');
}