import { defaultChain } from '@/src/lib/constants/token';
import { TOKEN_MAP } from '@/src/lib/constants/token';
import { ChainIdType } from '@/src/lib/types/ChainIdType';
import { TokenType } from '@/src/lib/types/TokenType';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import { formatNumber } from '@/src/lib/utils/formatNumber';
import { insertComma } from '@/src/lib/utils/insertComma';
import { applyDecimals } from '@/src/lib/utils/calcTick';
import { useAccount } from 'wagmi';

interface AddInfoProps {
  tokens: (Pick<TokenType, 'icon' | 'symbol'> & { amount: string })[];
  harvestTokens?: (Pick<TokenType, 'icon' | 'symbol' | 'decimal'> & {
    amount: string;
    value: string;
  })[];
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
  const { chainId } = useAccount();
  return (
    <section className="py-3 px-4 flex flex-col gap-2 rounded-lg bg-black-3 w-full">
      <div className="flex justify-between">
        <p className="p1">{title}</p>
        <h5 className="font-bold">{`₩ ${insertComma(formatNumber(totalLiquidity, 0))}`}</h5>
      </div>
      {tokens.map((token) => {
        const Icon =
          typeof token.icon === 'object'
            ? token.icon[chainId as ChainIdType]
            : token.icon;
        return (
          <div className="flex justify-between gap-2 pl-2" key={token.symbol}>
            <div className="flex items-center gap-1">
              <Icon className="w-5 h-5" />
              <p className="p1 text-black-8">{token.symbol}</p>
            </div>
            <p className="p1 font-medium">
              {insertComma(formatNumber(token.amount, 2))}
            </p>
          </div>
        );
      })}
      {harvestTokens && (
        <>
          <hr className="border-black-5" />
          <div className="flex flex-row justify-between">
            <p className="p1">
              {TOKEN_MAP[
                checkIsAvailableChain(chainId) ? chainId : defaultChain.id
              ].native.supportFarming
                ? 'Fee & Harvest'
                : 'Fee'}
            </p>
            <h5 className="font-bold">
              {`₩ ${insertComma(formatNumber(totalFee || '0', 0))}`}
            </h5>
          </div>
          {harvestTokens.map((token) => {
            const decimal =
              typeof token.decimal === 'object'
                ? token.decimal[
                    checkIsAvailableChain(chainId) ? chainId : defaultChain.id
                  ]
                : token.decimal;

            const Icon =
              typeof token.icon === 'object'
                ? token.icon[chainId as ChainIdType]
                : token.icon;
            return (
              <div
                className="flex justify-between gap-2 pl-2"
                key={token.symbol}
              >
                <div className="flex items-center gap-1">
                  <Icon className="w-5 h-5" />
                  <p className="p1 text-black-8">{token.symbol}</p>
                </div>
                <p className="p1 font-medium">
                  {insertComma(
                    formatNumber(applyDecimals(token.value, decimal), 2),
                  )}
                </p>
              </div>
            );
          })}
        </>
      )}
    </section>
  );
}
