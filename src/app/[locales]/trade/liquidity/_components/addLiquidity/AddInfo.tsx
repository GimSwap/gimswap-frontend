import { TokenType } from '@/src/lib/types/TokenType';
import { formatNumber } from '@/src/lib/utils/formatNumber';
import { insertComma } from '@/src/lib/utils/insertComma';

interface AddInfoProps {
  tokens: (Pick<TokenType, 'icon' | 'symbol'> & { amount: string })[];
  harvestTokens?: (Pick<TokenType, 'icon' | 'symbol'> & { amount: string })[];
  totalFee?: string;
  totalLiquidity: string;
  title?: string;
}

export default function AddInfo({
  tokens,
  totalLiquidity,
  harvestTokens,
  title = 'Total Liquidity',
  totalFee,
}: AddInfoProps) {
  return (
    <section className="py-3 px-4 flex flex-col gap-2 rounded-lg bg-black-3 w-full">
      <div className="flex justify-between">
        <p className="p1">{title}</p>
        <h5 className="font-bold">{`₩ ${insertComma(formatNumber(totalLiquidity, 0))}`}</h5>
      </div>
      {tokens.map((token) => (
        <div className="flex justify-between gap-2 pl-2" key={token.symbol}>
          <div className="flex items-center gap-1">
            <token.icon className="w-5 h-5" />
            <p className="p1 text-black-8">{token.symbol}</p>
          </div>
          <p className="p1 font-medium">
            {insertComma(formatNumber(token.amount, 2))}
          </p>
        </div>
      ))}
      {harvestTokens && (
        <>
          <hr className="border-black-5" />
          <div className="flex flex-row justify-between">
            <p className="p1">Fee & Harvest</p>
            <h5 className="font-bold">
              {`₩ ${insertComma(formatNumber(totalFee || '0', 0))}`}
            </h5>
          </div>
          {harvestTokens.map((token) => (
            <div className="flex justify-between gap-2 pl-2" key={token.symbol}>
              <div className="flex items-center gap-1">
                <token.icon className="w-5 h-5" />
                <p className="p1 text-black-8">{token.symbol}</p>
              </div>
              <p className="p1 font-medium">
                {insertComma(formatNumber(token.amount, 2))}
              </p>
            </div>
          ))}
        </>
      )}
    </section>
  );
}
