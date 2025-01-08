import Button from '@/src/components/Button';
import ButtonLoading from '@/src/components/ButtonLoading';
import { KRWO, USDT } from '@/src/lib/constants/token';
import { useApproveMax } from '@/src/lib/hook/useApproveMax';

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
  const {
    approveMax: approveUsdt,
    isPending: isUsdtPending,
    isSuccess: isUsdtSuccess,
  } = useApproveMax();
  const {
    approveMax: approveKrwo,
    isPending: isKrwoPending,
    isSuccess: isKrwoSuccess,
  } = useApproveMax();

  if ((isApproved.krwo && isApproved.usdt) || !spenderAddress || isPending)
    return null;

  const buttonText = (type: 'USDT' | 'KRWO') => {
    if (type === 'USDT') {
      return isApproved.usdt || isUsdtSuccess ? (
        'Approved'
      ) : isUsdtPending ? (
        <ButtonLoading />
      ) : (
        'Enable USDT'
      );
    }
    return isApproved.krwo || isKrwoSuccess ? (
      'Approved'
    ) : isKrwoPending ? (
      <ButtonLoading />
    ) : (
      'Enable KRWO'
    );
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
            await approveUsdt(
              USDT.contractAddress as `0x${string}`,
              spenderAddress!,
            );
            setIsApproved((prev) => ({ ...prev, usdt: true }));
          }}
          disabled={isApproved.usdt || isUsdtSuccess}
          className="flex flex-row justify-center items-center"
        >
          {buttonText('USDT')}
        </Button>
        <Button
          color="primary"
          size="xl"
          onClick={async () => {
            await approveKrwo(
              KRWO.contractAddress as `0x${string}`,
              spenderAddress!,
            );
            setIsApproved((prev) => ({ ...prev, krwo: true }));
          }}
          className="flex flex-row justify-center items-center"
          disabled={isApproved.krwo || isKrwoSuccess}
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
