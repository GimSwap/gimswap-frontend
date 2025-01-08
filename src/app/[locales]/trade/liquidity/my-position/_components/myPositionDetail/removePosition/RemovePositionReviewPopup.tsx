import PopupTemplate from '@/src/components/PopupTemplate';
import { insertComma } from '@/src/lib/utils/insertComma';
import { TokenType } from '@/src/lib/types/TokenType';
import ArrowDownIcon from '@/public/svg/arrow/arrow-narrow-down.svg';
import Button from '@/src/components/Button';
import { safeCalc } from '@/src/lib/utils/safeCalc';
import { formatNumber } from '@/src/lib/utils/formatNumber';
import { fetchGetDecreaseLiquidityInfo } from '@/src/lib/utils/api/liquidity/fetchGetDecreaseLiquidityInfo';
import { useAccount, useSendTransaction } from 'wagmi';
import { useFetch } from '@/src/lib/hook/useFetch';
import { fetchSendLog } from '@/src/lib/utils/api/fetchSendLog';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import AddLiquidityPendingPopup from '../../../../_components/addLiquidity/AddLiquidtyPendingPopup';
import TransactionSuccessPopup from '../../../../_components/TransactionSuccessPopup';
import { useLiquidityStore } from '@/src/lib/stores/liquidityStore/LiquidityStoreProvider';
import AddInfo from '../../../../_components/addLiquidity/AddInfo';
import { waitForTransactionReceipt } from '@wagmi/core';
import { wagmiConfig } from '@/src/lib/utils/wagmi';
import TransactionFailPopup from '@/src/components/popups/TransactionFailPopup';
import { revalidateTags } from '@/src/lib/utils/serverAction/revalidateTags';
import { MY_POSITION_REVALIDATE_TAG } from '@/src/lib/utils/api/liquidity/fetchGetMyPositions';

interface RemovePositionReviewPopupProps {
  open: boolean;
  onClose: () => void;
  removingTokens: ({
    amount: string;
  } & Pick<TokenType, 'symbol' | 'color' | 'icon'>)[];
  feeAndHarvestTokens: ({
    amount: string;
    value: string;
  } & Pick<TokenType, 'symbol' | 'color' | 'icon' | 'decimal'>)[];
  totalRemovingAmount: string;
  tokenId: number;
  totalLiquidity: string;
  totalAmount: string;
}

export default function RemovePositionReviewPopup({
  open,
  onClose,
  removingTokens,
  feeAndHarvestTokens,
  totalRemovingAmount,
  tokenId,
  totalLiquidity,
  totalAmount,
}: RemovePositionReviewPopupProps) {
  const { address } = useAccount();
  const { refetchPositions } = useLiquidityStore((state) => state);
  const { sendTransactionAsync } = useSendTransaction();
  const { openPopup, closePopup, closeAllPopup } = usePopupStore(
    (state) => state,
  );

  const totalFee = feeAndHarvestTokens.reduce(
    (acc, fee) => safeCalc.add(acc, fee.amount).toString(),
    '0',
  );

  const remainingAmount = insertComma(
    formatNumber(
      safeCalc.subtract(totalAmount, totalRemovingAmount).toString(),
      0,
    ),
  );

  const { data: removeLiquidityInfo } = useFetch(() =>
    fetchGetDecreaseLiquidityInfo({
      chainId: 8217,
      tokenId: tokenId,
      liquidity: formatNumber(totalLiquidity, 0),
      walletAddress: address!,
    }),
  );

  const handleRemoveLiquidity = async () => {
    if (!removeLiquidityInfo) return;
    try {
      openPopup(AddLiquidityPendingPopup, {
        type: 'remove',
        tokens: removingTokens,
        totalLiquidity: totalRemovingAmount,
        totalLiquidityWithOriginal: remainingAmount,
        feeAndHarvestTokens,
      });
      const tx = await sendTransactionAsync({
        to: removeLiquidityInfo.contractAddress,
        data: removeLiquidityInfo.data,
      });
      const { status } = await waitForTransactionReceipt(wagmiConfig, {
        chainId: 8217,
        hash: tx,
      });
      if (status === 'success') {
        closePopup(AddLiquidityPendingPopup);
        refetchPositions();
        await revalidateTags(MY_POSITION_REVALIDATE_TAG);
        openPopup(TransactionSuccessPopup, {
          txHash: tx,
          title: 'Remove success',
          type: 'remove',
          totalLiquidity: totalRemovingAmount,
          tokens: removingTokens,
          resultLiquidity: remainingAmount,
          harvestTokens: feeAndHarvestTokens,
        });
      } else throw new Error('Remove failed');
    } catch (error) {
      fetchSendLog({ name: 'removeLiquidity', error });
      openPopup(TransactionFailPopup, {
        onClose: () => closeAllPopup(),
      });
    }
  };

  return (
    <PopupTemplate
      open={open}
      onClose={onClose}
      showCloseButton
      closeButtonStyle="top-9"
    >
      <h3 className="font-bold -mt-4 ml-6">Review</h3>
      <section className="px-6 py-3 flex flex-col gap-3 items-center">
        <p className="p1 w-full">You receive</p>
        <AddInfo
          tokens={removingTokens}
          totalLiquidity={totalRemovingAmount}
          title="Removing Liquidity"
          harvestTokens={feeAndHarvestTokens}
          totalFee={totalFee}
        />
        <ArrowDownIcon />
        <section className="rounded-lg py-3 px-4 flex flex-row justify-between w-full bg-purple-50">
          <p className="text-purple-500 p1">Remaining Liquidity</p>
          <p className="text-purple-500 p1 font-bold">
            {`₩ ${remainingAmount}`}
          </p>
        </section>
        <Button
          size="xl"
          color="primary"
          onClick={handleRemoveLiquidity}
          className="my-5"
        >
          Remove
        </Button>
      </section>
    </PopupTemplate>
  );
}
