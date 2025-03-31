import { OPEN_VOUCHER } from '@/src/lib/constants/token';
import { TokenType } from '@/src/lib/types/TokenType';

interface TokenContainerProps {
  children: React.ReactNode;
  token: TokenType;
}

export default function TokenContainer({
  children,
  token,
}: TokenContainerProps) {
  return (
    <div
      className={`rounded-lg bg-black-3 w-full ${
        token === OPEN_VOUCHER ? 'p-[15px] border border-purple-500' : 'p-4'
      }`}
    >
      {children}
    </div>
  );
}
