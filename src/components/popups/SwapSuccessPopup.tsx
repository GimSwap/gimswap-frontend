import PopupTemplate from '../PopupTemplate';
import ArrowDownIcon from '@/public/svg/arrow/arrow-narrow-down.svg';
import { CHAIN_ID_TO_BLOCK_EXPLORER } from '@/src/lib/constants/blockExplorer';
import { insertComma } from '@/src/lib/utils/insertComma';
import { useAccount } from 'wagmi';
import { ChainIdType } from '@/src/lib/types/ChainIdType';
import PlusIcon from '@/public/svg/plus-thin.svg';
import { useAddToken } from '@/src/lib/hook/useAddToken';
import { KRWO } from '@/src/lib/constants/token';
import Button from '../Button';
import TokenIcon from '../TokenIcon';

interface SwapProgressPopupProps {
  open: boolean;
  onClose: () => void;
  tokens: {
    pay: {
      symbol: string;
      amount: string;
    };
    receive: {
      symbol: string;
      amount: string;
    };
  };
  hash: string;
  closePrevPopup?: () => void;
  onComplete?: () => void;
}

export default function SwapSuccessPopup({
  onClose,
  open,
  tokens,
  hash,
  closePrevPopup,
  onComplete,
}: SwapProgressPopupProps) {
  const { chainId } = useAccount();
  const { addToken } = useAddToken();

  const handleAddToken = async () => {
    await addToken({
      address: KRWO.contractAddress[chainId as ChainIdType],
      image: KRWO.imageUrl[chainId as ChainIdType],
      symbol: KRWO.symbol,
      decimals: KRWO.decimal,
    });
  };

  const handleClose = () => {
    onComplete?.();
    closePrevPopup?.();
    onClose();
  };

  return (
    <PopupTemplate
      showCloseButton
      open={open}
      onClose={handleClose}
      icon="success"
    >
      <section className="px-6 flex flex-col items-center">
        <h3 className="font-bold text-center pb-4">Swap success!</h3>
        <section className="rounded-lg bg-black-3 flex flex-col justify-center items-center p-4 w-full">
          <div className="flex gap-2 items-center">
            <TokenIcon
              symbol={tokens.pay.symbol}
              width={20}
              height={20}
              alt={tokens.pay.symbol}
              chainId={chainId}
            />
            <h5 className="text-black-8 font-medium">{`${insertComma(
              tokens.pay.amount,
            )}
            ${tokens.pay.symbol}`}</h5>
          </div>
          <ArrowDownIcon className="my-[6px]" />
          <div className="flex gap-2 items-center">
            <TokenIcon
              symbol={tokens.receive.symbol}
              width={20}
              height={20}
              alt={tokens.receive.symbol}
              chainId={chainId}
            />
            <h5 className="text-black-8 font-medium">{`${insertComma(
              tokens.receive.amount,
            )}
            ${tokens.receive.symbol}`}</h5>
          </div>
          <button
            className="px-2 py-[6px] bg-black-1 flex flex-row gap-1 items-center mt-4 rounded-full border border-black-4"
            onClick={handleAddToken}
          >
            <PlusIcon className="w-4 h-4 stroke-purple-500" />
            <p className="p1 text-purple-500 font-medium">Add KRWO to Wallet</p>
          </button>
        </section>
        <a
          href={`${CHAIN_ID_TO_BLOCK_EXPLORER[chainId!]}/${hash}`}
          className="text-purple-500 underline underline-offset-[2.5px] mt-4 mb-5"
          target="_blank"
        >
          View on Explorer
        </a>
        <Button
          size="xl"
          color="primary"
          onClick={handleClose}
          className="my-5"
        >
          Confirm
        </Button>
      </section>
    </PopupTemplate>
  );
}
