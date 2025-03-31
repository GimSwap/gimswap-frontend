const MAX_AMOUNT = 100000000000000;

interface HandleInputAmountProps {
  value: string;
  setAmount: (value: string) => void;
}

export const handleInputAmount = ({
  value,
  setAmount,
}: HandleInputAmountProps) => {
  const trimmedValue = value.trim();
  if (isNaN(+trimmedValue)) return;
  if (+trimmedValue > MAX_AMOUNT) return;
  if (/^0+$/.test(trimmedValue)) return;
  if (/^0\d+/.test(trimmedValue)) return;
  if (trimmedValue.includes('.')) return;
  setAmount(trimmedValue);
};
