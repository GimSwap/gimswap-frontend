import PopupTemplate from '@/src/components/PopupTemplate';
import { insertComma } from '@/src/lib/utils/insertComma';
import { TokenType } from '@/src/lib/types/TokenType';
import ArrowDownIcon from '@/public/svg/arrow/arrow-narrow-down.svg';
import Button from '@/src/components/Button';
import { safeCalc } from '@/src/lib/utils/safeCalc';
import { formatNumber } from '@/src/lib/utils/formatNumber';
import { fetchGetDecreaseLiquidityInfo } from '@/src/lib/utils/api/liquidity/fetchGetDecreaseLiquidityInfo';
import { useAccount } from 'wagmi';
import { useSendTransaction } from '@/src/lib/hook/useSendTransaction';
import { useFetch } from '@/src/lib/hook/useFetch';
import { fetchSendLog } from '@/src/lib/utils/api/fetchSendLog';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import AddLiquidityPendingPopup from '../../../../_components/addLiquidity/AddLiquidtyPendingPopup';
import TransactionSuccessPopup from '../../../../_components/TransactionSuccessPopup';
import { useLiquidityStore } from '@/src/lib/stores/liquidityStore/LiquidityStoreProvider';
import AddInfo from '../../../../_components/addLiquidity/AddInfo';
import TransactionFailPopup from '@/src/components/popups/TransactionFailPopup';
import { useQuery } from '@tanstack/react-query';
import MyPositionDetailPopup from '../../MyPositionDetailPopup';
import { useEffect, useState } from 'react';
import { fetchGetTransferReceipt } from '@/src/lib/utils/api/fetchGetReceipt';

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
  const { address, chainId } = useAccount();
  const { refetchPositions } = useLiquidityStore((state) => state);
  const { sendTransactionAsync } = useSendTransaction();
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [shouldPolling, setShouldPolling] = useState(false);

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
      chainId: chainId!,
      tokenId: tokenId,
      liquidity: formatNumber(totalLiquidity, 0),
      walletAddress: address!,
    }),
  );

  const { data: state } = useQuery({
    queryKey: ['getTxReceipt', address],
    queryFn: () =>
      fetchGetTransferReceipt({ chainId: chainId!, txHash: txHash! }),
    enabled: !!shouldPolling && !!chainId && !!address,
    refetchInterval: 1000,
    select: (data) => data.status,
  });

  const handleRemoveLiquidity = async () => {
    if (!removeLiquidityInfo) return;
    openPopup(AddLiquidityPendingPopup, {
      type: 'remove',
      tokens: removingTokens,
      totalLiquidity: totalRemovingAmount,
      totalLiquidityWithOriginal: remainingAmount,
      feeAndHarvestTokens,
    });
    try {
      const tx = await sendTransactionAsync({
        to: removeLiquidityInfo.contractAddress,
        data: removeLiquidityInfo.data,
      });
      setTxHash(tx);
      setShouldPolling(true);
    } catch (error) {
      console.error(error);
      openPopup(TransactionFailPopup, {
        onClose: () => closeAllPopup(),
      });
    }
  };

  useEffect(() => {
    switch (state) {
      case 'SUCCESS':
        closePopup(AddLiquidityPendingPopup);
        refetchPositions();
        openPopup(TransactionSuccessPopup, {
          txHash: txHash!,
          title: 'Remove success',
          type: 'remove',
          totalLiquidity: totalRemovingAmount,
          tokens: removingTokens,
          resultLiquidity: remainingAmount,
          harvestTokens: feeAndHarvestTokens,
        });
        setShouldPolling(false);
        break;
      case 'FAILED':
        fetchSendLog({
          name: 'removeLiquidity',
          error: new Error('Remove failed'),
        });
        openPopup(TransactionFailPopup, {
          onClose: () => closeAllPopup(),
        });
        setShouldPolling(false);
        break;
      default:
        break;
    }
  }, [chainId, address, state]);

  useEffect(() => {
    if (!chainId || !address) closePopup(MyPositionDetailPopup);
  }, [chainId, address]);

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
