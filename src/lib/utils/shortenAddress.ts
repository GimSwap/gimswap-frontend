export const shortenAddress = (
  address: string,
  chars = 2,
  endChars = 4,
): string => {
  if (!address || address.length < chars + endChars + 2) return '';

  const start = address.substring(0, chars + 2);
  const end = address.substring(address.length - endChars);

  return `${start}...${end}`;
};
