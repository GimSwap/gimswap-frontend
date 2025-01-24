import ArrowDownIcon from '@/public/svg/arrow/arrow-narrow-down.svg';
import PopupTemplate from '@/src/components/PopupTemplate';
import AddInfo from './addLiquidity/AddInfo';
import { TokenType } from '@/src/lib/types/TokenType';
import { insertComma } from '@/src/lib/utils/insertComma';
import { formatNumber } from '@/src/lib/utils/formatNumber';
import { defaultChain, TOKEN_MAP } from '@/src/lib/constants/token';
import { Link } from '@/src/i18n/routing';
import Button from '@/src/components/Button';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import { useAccount } from 'wagmi';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import { CHAIN_ID_TO_BLOCK_EXPLORER } from '@/src/lib/constants/blockExplorer';

interface TransactionSuccessPopupProps {
  open: boolean;
  title: string;
  tokens: (Pick<TokenType, 'symbol' | 'color' | 'icon'> & { amount: string })[];
  totalLiquidity: string;
  harvestTokens?: (Pick<TokenType, 'symbol' | 'color' | 'icon' | 'decimal'> & {
    amount: string;
    value: string;
  })[];
  type: 'increase' | 'remove' | 'collect';
  resultLiquidity?: string;
  txHash: string;
}

const resultTitleMap = {
  remove: 'remaining Liquidity',
  increase: 'Total Liquidity',
  collect: '',
} as const;

export default function TransactionSuccessPopup({
  open,
  title,
  tokens,
  totalLiquidity,
  type,
  resultLiquidity,
  txHash,
  harvestTokens,
}: TransactionSuccessPopupProps) {
  const { chainId } = useAccount();
  const { closeAllPopup } = usePopupStore((state) => state);

  const titleMap = {
    increase: 'Liquidity Added',
    remove: 'Liquidity Removed',
    collect: TOKEN_MAP[
      checkIsAvailableChain(chainId) ? chainId : defaultChain.id
    ].native.supportFarming
      ? 'Fee & Harvest'
      : 'Fee',
  } as const;

  return (
    <PopupTemplate
      open={open}
      onClose={closeAllPopup}
      showCloseButton
      icon="success"
    >
      <section className="flex flex-col items-center px-6 pb-5">
        <h3 className="font-bold pb-4">{title}</h3>
        <div className="w-full flex flex-col items-center max-lg:max-h-[calc(95dvh-255px)] overflow-y-scroll scrollbar-hide">
          <AddInfo
            tokens={tokens}
            totalLiquidity={totalLiquidity}
            title={titleMap[type]}
            harvestTokens={harvestTokens}
          />
          {resultLiquidity && (
            <>
              <ArrowDownIcon className="my-3" />
              <section className="px-4 py-3 rounded-lg bg-purple-50 w-full flex flex-row justify-between">
                <p className="text-purple-500 p1">{resultTitleMap[type]}</p>
                <p className="text-purple-500 p1 font-bold">
                  {`₩ ${insertComma(formatNumber(resultLiquidity, 0))}`}
                </p>
              </section>
            </>
          )}
          <Link
            className="text-h5 text-purple-500 font-medium pt-5 underline underline-offset-[2.5px]"
            href={`${
              CHAIN_ID_TO_BLOCK_EXPLORER[
                checkIsAvailableChain(chainId) ? chainId : defaultChain.id
              ]
            }/${txHash}`}
            target="_blank"
          >
            View on Explorer
          </Link>
        </div>
        <Button
          color="primary"
          size="xl"
          className="my-5"
          target="_blank"
          onClick={closeAllPopup}
        >
          Confirm
        </Button>
      </section>
    </PopupTemplate>
  );
}
