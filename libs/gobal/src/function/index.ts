export function CustomText(text: string): string {
  return text
    ?.toLowerCase()
    ?.normalize('NFD')
    ?.replace(/[\u0300-\u036f]/g, '')
    ?.replace(/đ/g, 'd')
    ?.replace(/Đ/g, 'D');
}
