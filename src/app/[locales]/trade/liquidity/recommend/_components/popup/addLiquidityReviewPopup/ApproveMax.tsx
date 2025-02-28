import Button from '@/src/components/Button';
import ButtonLoading from '@/src/components/ButtonLoading';
import { KRWO, USDT } from '@/src/lib/constants/token';
import { useApproveMax } from '@/src/lib/hook/useApproveMax';
import { ChainIdType } from '@/src/lib/types/ChainIdType';
import { useAccount } from 'wagmi';

interface ApproveMaxProps {
  spenderAddress: `0x${string}` | undefined;
  isPending: boolean;
  isApproved: {
    krwo: boolean;
    usdt: boolean;
  };
  setIsApproved: React.Dispatch<
    React.SetStateAction<{
      krwo: boolean;
      usdt: boolean;
    }>
  >;
}

export default function ApproveMax({
  spenderAddress,
  isPending,
  isApproved,
  setIsApproved,
}: ApproveMaxProps) {
  const { chainId } = useAccount();
  const { approveMax: approveUsdt, isPending: isUsdtPending } = useApproveMax();
  const { approveMax: approveKrwo, isPending: isKrwoPending } = useApproveMax();

  if ((isApproved.krwo && isApproved.usdt) || !spenderAddress || isPending)
    return null;

  const buttonText = (type: 'USDT' | 'KRWO') => {
    if (type === 'USDT') {
      return isApproved.usdt ? (
        'Approved'
      ) : isUsdtPending ? (
        <ButtonLoading />
      ) : (
        'Enable USDT'
      );
    }
    return isApproved.krwo ? (
      'Approved'
    ) : isKrwoPending ? (
      <ButtonLoading />
    ) : (
      'Enable KRWO'
    );
  };

  const handleClickApprove = async (
    contractAddress: `0x${string}`,
    token: 'USDT' | 'KRWO',
  ) => {
    const isPending = token === 'USDT' ? isUsdtPending : isKrwoPending;

    if (isPending) return;

    const approve = token === 'USDT' ? approveUsdt : approveKrwo;

    const { status } = await approve(
      chainId as ChainIdType,
      contractAddress,
      spenderAddress!,
    );

    if (status === 'success')
      setIsApproved((prev) => ({ ...prev, [token]: true }));
  };

  return (
    <>
      <div className="flex flex-row gap-1 pb-4 justify-start w-full">
        <p className="bg-black-8 w-5 h-5 text-black-1 rounded-full flex items-center justify-center p1 font-medium">
          1
        </p>
        <p className="p1 text-black-8 font-medium">Approve USDT and KRWO.</p>
      </div>
      <div className="flex flex-row gap-2 pb-6 w-full">
        <Button
          color="primary"
          size="xl"
          onClick={async () => {
            await handleClickApprove(
              USDT.contractAddress[chainId as ChainIdType] as `0x${string}`,
              'USDT',
            );
          }}
          disabled={isApproved.usdt}
          className="flex flex-row justify-center items-center whitespace-nowrap"
        >
          {buttonText('USDT')}
        </Button>
        <Button
          color="primary"
          size="xl"
          onClick={async () => {
            await handleClickApprove(
              KRWO.contractAddress[chainId as ChainIdType] as `0x${string}`,
              'KRWO',
            );
          }}
          className="flex flex-row justify-center items-center whitespace-nowrap"
          disabled={isApproved.krwo}
        >
          {buttonText('KRWO')}
        </Button>
      </div>
      <div className="flex flex-row gap-1 pb-4 justify-start w-full">
        <p className="bg-black-8 w-5 h-5 text-black-1 rounded-full flex items-center justify-center p1 font-medium">
          2
        </p>
        <p className="p1 text-black-8 font-medium">
          Review the follow information and add.
        </p>
      </div>
    </>
  );
}
