import PopupTemplate from '@/src/components/PopupTemplate';
import { TokenType } from '@/src/lib/types/TokenType';
import AddInfo from './AddInfo';
import ArrowDownIcon from '@/public/svg/arrow/arrow-narrow-down.svg';
import { insertComma } from '@/src/lib/utils/insertComma';
import { formatNumber } from '@/src/lib/utils/formatNumber';

interface PendingPopupProps {
  open: boolean;
  onClose: () => void;
  tokens: (Pick<TokenType, 'icon' | 'symbol'> & { amount: string })[];
  totalLiquidity: string;
  totalLiquidityWithOriginal?: string;
  type: 'add' | 'increase' | 'remove' | 'collect';
  feeAndHarvestTokens?: (Pick<TokenType, 'icon' | 'symbol'> & {
    amount: string;
  })[];
}

const titleMap = {
  add: 'Total Liquidity',
  increase: 'Add Liquidity',
  remove: 'Removing Liquidity',
  collect: 'Fee & Harvest',
} as const;

const resultTitleMap = {
  add: 'Total Liquidity',
  increase: 'Total Liquidity',
  remove: 'Remaining Liquidity',
  collect: '',
} as const;

export default function AddLiquidityPendingPopup({
  open,
  onClose,
  tokens,
  totalLiquidity,
  totalLiquidityWithOriginal,
  type,
  feeAndHarvestTokens,
}: PendingPopupProps) {
  return (
    <PopupTemplate
      open={open}
      onClose={onClose}
      showCloseButton
      icon={'loading'}
    >
      <section className="flex flex-col items-center px-6 pt-4 pb-5">
        <h3 className="font-bold py-4">Waiting For Confirmation</h3>
        <AddInfo
          tokens={tokens}
          totalLiquidity={totalLiquidity}
          title={titleMap[type]}
          harvestTokens={feeAndHarvestTokens}
        />
        {totalLiquidityWithOriginal ? (
          <>
            <ArrowDownIcon className="my-3" />
            <section className="px-4 py-3 rounded-lg bg-purple-50 w-full flex flex-row justify-between">
              <p className="text-purple-500 p1">{resultTitleMap[type]}</p>
              <p className="text-purple-500 p1 font-bold">
                {`₩ ${insertComma(formatNumber(totalLiquidityWithOriginal, 0))}`}
              </p>
            </section>
          </>
        ) : null}
        <h5 className="font-medium text-black-6 pt-4">
          Proceed in your wallet
        </h5>
      </section>
    </PopupTemplate>
  );
}
