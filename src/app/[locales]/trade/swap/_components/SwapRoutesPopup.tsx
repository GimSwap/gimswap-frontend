import PopupTemplate from '@/src/components/PopupTemplate';
import { GetSwapRouteResponseType } from '@/src/lib/types/api/swap/GetSwapRouteType';
import readingGlass from '@/public/lottie/reading-glass.json';
import { TokenListType } from '@/src/lib/types/api/swap/GetTokenList';
import ArrowNarrowDownIcon from '@/public/svg/arrow/arrow-narrow-down.svg';
import TokenIcon from '@/src/components/TokenIcon';
import { useAccount } from 'wagmi';
import Button from '@/src/components/Button';
import dynamic from 'next/dynamic';
import { CONTRACT_ADDRESS_TO_SYMBOL } from '@/src/lib/constants/contractAdressToSymbol';
import { formatNumber } from '@/src/lib/utils/formatNumber';
import LineDashed from '@/public/svg/line-dashed.svg';
import { safeCalc } from '@/src/lib/utils/safeCalc';

const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
});

interface SwapRoutesPopupProps {
  routes: GetSwapRouteResponseType;
  open: boolean;
  onClose: () => void;
  payToken: TokenListType;
  receiveToken: TokenListType;
}

export default function SwapRoutesPopup({
  routes,
  payToken,
  receiveToken,
  open,
  onClose,
}: SwapRoutesPopupProps) {
  const { chainId } = useAccount();

  return (
    <PopupTemplate
      open={open}
      onClose={onClose}
      showCloseButton
      closeButtonStyle="top-9"
      useTemplate={false}
    >
      <section className="flex flex-col items-center">
        <div className="px-6 w-full">
          <h3 className="font-bold">Saved</h3>
          <section className="my-3 p-4 flex flex-row gap-1 items-center justify-center bg-black-3 rounded-lg">
            <Lottie
              animationData={readingGlass}
              loop={true}
              className="w-6 h-[24px]"
            />
            <p className="text-sm text-gray-500">
              Proceed with lowest price route
            </p>
          </section>
        </div>
        <section className="flex flex-row gap-1 justify-center items-center pl-6 overflow-scroll scrollbar-hide pb-5 pt-3 w-full">
          <div className="py-[6px] px-2 bg-black-2 border border-black-4 rounded-full flex flex-row gap-1 items-center min-w-fit">
            <TokenIcon
              symbol={payToken.symbol}
              alt={payToken.symbol}
              width={24}
              height={24}
              chainId={chainId}
            />
            <p className="p1 text-black-8">{payToken.symbol}</p>
          </div>
          <LineDashed className="min-w-[14px] h-[2px] stroke-black-6" />
          <section className="flex flex-col gap-2">
            {routes.routes.map((route, index) => {
              return (
                <section
                  key={index}
                  className="flex flex-row gap-1 items-center rounded-full bg-black-2 border border-black-4 py-[6px] px-2 justify-center"
                >
                  {route.paths.map(({ tokens }, index) => {
                    if (
                      route.paths.length !== 1 &&
                      index === route.paths.length - 1
                    )
                      return;

                    const symbol =
                      route.paths.length === 1
                        ? 'Single Hop'
                        : CONTRACT_ADDRESS_TO_SYMBOL[tokens[1].toLowerCase()] ||
                          'Unknown';

                    return (
                      <section
                        key={index}
                        className="flex flex-row gap-1 items-center whitespace-nowrap min-w-fit justify-center"
                      >
                        <p className="p1 text-black-8">
                          {`${symbol} ${formatNumber(safeCalc.multiply(route.ratio, 100).toString(), 1)}%`}
                        </p>
                        {index !== route.paths.length - 2 &&
                          route.paths.length !== 1 && (
                            <ArrowNarrowDownIcon className="min-w-5 h-[20px] stroke-black-6 -rotate-90" />
                          )}
                      </section>
                    );
                  })}
                </section>
              );
            })}
          </section>

          <LineDashed className="min-w-[14px] h-[2px] stroke-black-6" />
          <div className="py-[6px] px-2 bg-black-2 border border-black-4 rounded-full flex flex-row gap-1 items-center min-w-fit mr-6">
            <TokenIcon
              symbol={receiveToken.symbol}
              alt={receiveToken.symbol}
              width={24}
              height={24}
              chainId={chainId}
            />
            <p className="p1 text-black-8">{receiveToken.symbol}</p>
          </div>
        </section>

        <section className="px-6 w-full">
          <div className="flex flex-row justify-between py-1">
            <p className="text-black-8 p1">Route</p>
            <p className="text-black-12 p1">
              {`Utilizing ${routes.routes.reduce((acc, route) => {
                return acc + route.paths.length;
              }, 0)} LP${routes.routes.length > 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="flex flex-row justify-between py-1">
            <p className="text-black-8 p1">Saved</p>
            <p className="text-black-12 p1">
              {routes?.saved !== undefined
                ? `~ ₩ ${routes?.saved} profit`
                : '- profit'}
            </p>
          </div>
          <Button size="xl" color="primary" onClick={onClose} className="my-5">
            Confirm
          </Button>
        </section>
      </section>
    </PopupTemplate>
  );
}
