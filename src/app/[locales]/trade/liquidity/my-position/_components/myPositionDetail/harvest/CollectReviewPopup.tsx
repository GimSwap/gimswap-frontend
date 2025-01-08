import Button from '@/src/components/Button';
import PopupTemplate from '@/src/components/PopupTemplate';
import { useFetch } from '@/src/lib/hook/useFetch';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import { TokenType } from '@/src/lib/types/TokenType';
import { fetchSendLog } from '@/src/lib/utils/api/fetchSendLog';
import { fetchGetCollectInfo } from '@/src/lib/utils/api/liquidity/fetchGetCollectInfo';
import { formatNumber } from '@/src/lib/utils/formatNumber';
import { insertComma } from '@/src/lib/utils/insertComma';
import { useAccount, useSendTransaction } from 'wagmi';
import AddLiquidityPendingPopup from '../../../../_components/addLiquidity/AddLiquidtyPendingPopup';
import TransactionSuccessPopup from '../../../../_components/TransactionSuccessPopup';
import { useLiquidityStore } from '@/src/lib/stores/liquidityStore/LiquidityStoreProvider';

interface CollectReviewPopupProps {
  totalAmount: string;
  open: boolean;
  onClose: () => void;
  tokens: ({
    amount: string;
  } & Pick<TokenType, 'symbol' | 'color' | 'icon'>)[];
  tokenId: number;
}

export default function CollectReviewPopup({
  totalAmount,
  open,
  onClose,
  tokens,
  tokenId,
}: CollectReviewPopupProps) {
  const { address } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const { setOptimisticPositions, optimisticPositions } = useLiquidityStore(
    (state) => state,
  );
  const { openPopup, closePopup } = usePopupStore((state) => state);
  const { data, loading } = useFetch(() =>
    fetchGetCollectInfo({
      chainId: 8217,
      tokenId,
      walletAddress: address!,
    }),
  );

  const handleCollect = async () => {
    if (!data) return;
    try {
      openPopup(AddLiquidityPendingPopup, {
        tokens: tokens,
        type: 'collect',
        totalLiquidity: totalAmount,
      });
      const tx = await sendTransactionAsync({
        to: data.contractAddress,
        data: data.data,
      });
      closePopup(AddLiquidityPendingPopup);
      openPopup(TransactionSuccessPopup, {
        title: 'Collect Success',
        tokens: tokens,
        totalLiquidity: totalAmount,
        type: 'collect',
        txHash: tx,
      });
      setOptimisticPositions(
        optimisticPositions.map((position) =>
          position.tokenId === tokenId
            ? { ...position, fee: { usdtFee: '0', krwoFee: '0' } }
            : position,
        ),
      );
    } catch (error) {
      fetchSendLog({ name: 'collect', error });
    }
  };

  return (
    <PopupTemplate
      open={open}
      onClose={onClose}
      showCloseButton
      useTemplate={false}
      closeButtonStyle="!top-9"
    >
      <section className="px-6 flex flex-col gap-3">
        <h3 className="font-bold mb-1">Collect Review</h3>
        <p className="p1">You receive</p>
        <section className="py-3 px-4 bg-black-3">
          <div className="flex flex-row justify-between mb-2">
            <p className="p1">Fee & Harvest</p>
            <h5 className="font-bold">
              ₩ {insertComma(formatNumber(totalAmount, 0))}
            </h5>
          </div>
          <div className="flex flex-col gap-3">
            {tokens.map((token) => (
              <div
                className="flex flex-row justify-between items-center"
                key={token.symbol}
              >
                <div className="flex flex-row gap-1">
                  <token.icon className="w-5 h-5 min-w-5" />
                  <p className="p1">{token.symbol}</p>
                </div>
                <p className="p1">
                  {insertComma(formatNumber(token.amount, 2))}
                </p>
              </div>
            ))}
          </div>
        </section>
        <Button
          color="primary"
          size="xl"
          className="my-5"
          disabled={loading}
          onClick={handleCollect}
        >
          Collect
        </Button>
      </section>
    </PopupTemplate>
  );
}
