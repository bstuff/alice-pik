export function filterPhone(phone = '') {
  const onlyNumbers = phone
    .replace(/\D/g, '')
    .replace(/^([0-6,9])(\d+)/, '8$1$2')
    .replace(/^8/, '7')
    .replace(/^7/, '+7');

  return onlyNumbers;
}
