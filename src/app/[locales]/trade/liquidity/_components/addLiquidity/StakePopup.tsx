import PopupTemplate from '@/src/components/PopupTemplate';
import AddInfo from './AddInfo';
import { TokenType } from '@/src/lib/types/TokenType';
import { Link } from '@/src/i18n/routing';
import { defaultChain, KLAYTN } from '@/src/lib/constants/token';
import Button from '@/src/components/Button';
import { fetchGetStakeInfo } from '@/src/lib/utils/api/liquidity/fetchGetStakeInfo';
import { useAccount, useSendTransaction } from 'wagmi';
import { getTokenId } from '@/src/lib/utils/getTokenId';
import { useState } from 'react';
import ButtonLoading from '@/src/components/ButtonLoading';
import { fetchSendLog } from '@/src/lib/utils/api/fetchSendLog';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import TransactionFailPopup from '@/src/components/popups/TransactionFailPopup';
import { useLiquidityStore } from '@/src/lib/stores/liquidityStore/LiquidityStoreProvider';
import { waitForTransactionReceipt } from '@wagmi/core';
import { wagmiConfig } from '@/src/lib/utils/wagmi';
import { ChainIdType } from '@/src/lib/types/ChainIdType';

interface StakePopupProps {
  open: boolean;
  onClose: () => void;
  tokens: (TokenType & { amount: string })[];
  totalLiquidity: string;
  txHash?: string;
  tokenId?: number;
  closeCallback?: () => void;
}

export default function StakePopup({
  open,
  onClose,
  tokens,
  totalLiquidity,
  txHash,
  tokenId,
  closeCallback,
}: StakePopupProps) {
  const { address, chainId } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const [isLoading, setIsLoading] = useState(false);
  const { openPopup, closeAllPopup } = usePopupStore((state) => state);
  const { setOptimisticPositions, optimisticPositions } = useLiquidityStore(
    (state) => state,
  );

  const handleStake = async () => {
    try {
      setIsLoading(true);
      const { data, contractAddress } = await fetchGetStakeInfo({
        chainId: chainId || defaultChain.id,
        tokenId: tokenId! || (await getTokenId(txHash!))!,
        walletAddress: address!,
      });
      const tx = await sendTransactionAsync({
        to: contractAddress,
        data: data,
      });

      const { status } = await waitForTransactionReceipt(wagmiConfig, {
        chainId: chainId as ChainIdType,
        hash: tx,
      });

      if (status === 'success') {
        optimisticPositions &&
          setOptimisticPositions(
            optimisticPositions.map((position) =>
              position.tokenId === tokenId
                ? { ...position, farming: true }
                : position,
            ),
          );
        setIsLoading(false);

        if (tokenId) onClose();
        else {
          closeCallback?.();
          closeAllPopup();
        }
      } else throw new Error('Stake failed');
    } catch (error) {
      setIsLoading(false);
      fetchSendLog({ name: 'stake', error });
      openPopup(TransactionFailPopup);
    }
  };
  return (
    <PopupTemplate
      open={open}
      onClose={() => {
        onClose();
        closeCallback?.();
      }}
      showCloseButton
      icon="success"
    >
      <section className="flex flex-col items-center px-6 pt-4">
        <h3 className="font-bold pt-4 pb-2">Stake and Get more profit</h3>
        <h5 className="text-black-8 font-medium pb-4 text-center">
          Successfully added to liquidity.
          <br />
          Sign and stake to complete the final step.
        </h5>
        <AddInfo tokens={tokens} totalLiquidity={totalLiquidity} />
        {txHash && (
          <Link
            className="text-h5 text-purple-500 font-medium pt-5 underline underline-offset-[2.5px]"
            href={`${KLAYTN.blockExplorerUrl}/tx/${txHash}`}
          >
            View on Explorer
          </Link>
        )}
        <Button
          color="primary"
          size="xl"
          onClick={handleStake}
          className="my-5 min-h-[54px] flex items-center justify-center"
          target="_blank"
        >
          {isLoading ? <ButtonLoading /> : 'Stake'}
        </Button>
      </section>
    </PopupTemplate>
  );
}
