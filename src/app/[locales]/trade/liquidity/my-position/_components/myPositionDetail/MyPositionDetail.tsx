import { PaginationPushType } from '@/src/components/popups/PopupPagination';
import { useLiquidityStore } from '@/src/lib/stores/liquidityStore/LiquidityStoreProvider';
import PositionInfo from './PositionInfo';
import BarChartAndInfo from './BarChartAndInfo';
import Harvest from './harvest/Harvest';
import { defaultChain, KRWO, TOKEN_MAP, USDT } from '@/src/lib/constants/token';
import Button from '@/src/components/Button';
import Link from 'next/link';
import ChevronRightIcon from '@/public/svg/chevron/right.svg';
import MyPositionAddLiquidityPopup from './addLiquidity/MyPositionAddLiquidityPopup';
import { useEffect } from 'react';
import RemovePosition from './removePosition/RemovePosition';
import { safeCalc } from '@/src/lib/utils/safeCalc';
import {
  applyDecimals,
  calcKrwPrice,
  usdtTickToKrw,
} from '@/src/lib/utils/calcTick';
import { fetchGetMyPositionDetail } from '@/src/lib/utils/api/liquidity/fetchGetPositionDetail';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import StakePopup from '../../../_components/addLiquidity/StakePopup';
import { useQueries } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import MyPositionDetailPopup from '../MyPositionDetailPopup';
import { ChainIdType } from '@/src/lib/types/ChainIdType';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import { SWAP_SERVICE_LINK } from '@/src/lib/constants/swapServiceLink';
import { fetchGetCurrentTick } from '@/src/lib/utils/api/liquidity/fetchGetCurrentTick';
import { GetCurrentTickResponseType } from '@/src/lib/types/api/liquidity/GetCurrentTickType';

interface MyPositionDetailProps {
  next: PaginationPushType;
  reset: () => void;
}

export default function MyPositionDetail({
  next,
  reset,
}: MyPositionDetailProps) {
  const { selectedMyPosition } = useLiquidityStore((state) => state);

  const { chainId } = useAccount();
  const { openPopup, closePopup } = usePopupStore((state) => state);
  const [
    { data: positionDetail, isPending: positionDetailLoading, refetch },
    { data: currentTick },
  ] = useQueries({
    queries: [
      {
        queryKey: ['positionDetail', selectedMyPosition?.tokenId!],
        queryFn: () =>
          fetchGetMyPositionDetail({
            chainId: chainId!,
            tokenId: selectedMyPosition?.tokenId!,
          }),
        enabled: !!chainId,
      },
      {
        queryKey: ['usdtCurrentTick', chainId],
        queryFn: () =>
          fetchGetCurrentTick({
            chainId: checkIsAvailableChain(chainId) ? chainId : defaultChain.id,
            token: 'usdt',
          }),
        select: (data: GetCurrentTickResponseType) => data?.currentTick,
      },
    ],
  });

  const currentPrice = currentTick ? +usdtTickToKrw(currentTick, chainId) : 0;

  const usdtAmount = safeCalc
    .multiply(
      applyDecimals(
        positionDetail?.liquidity.token0.value || '0',
        USDT.decimal[
          checkIsAvailableChain(chainId) ? chainId : defaultChain.id
        ],
        10,
      ),
      currentPrice,
    )
    .toString();

  const krwoAmount = applyDecimals(
    positionDetail?.liquidity.token1.value || '0',
    KRWO.decimal,
    10,
  );

  const totalAmount = safeCalc.add(usdtAmount, krwoAmount).toString();

  const nativeFee = calcKrwPrice(
    chainId,
    positionDetail?.harvest.tickKrwo || 0,
    positionDetail?.harvest.value || '0',
    TOKEN_MAP[checkIsAvailableChain(chainId) ? chainId : defaultChain.id].native
      .decimal,
    TOKEN_MAP[checkIsAvailableChain(chainId) ? chainId : defaultChain.id].native
      .symbol,
  );

  const krwoFee = applyDecimals(
    positionDetail?.fee.token1.value || '0',
    KRWO.decimal,
    10,
  );

  const usdtFee = applyDecimals(
    positionDetail?.fee.token0.value || '0',
    USDT.decimal[checkIsAvailableChain(chainId) ? chainId : defaultChain.id],
    10,
  );

  const usdtFeeInKRWO = safeCalc
    .multiply(usdtFee, currentPrice)
    .floor()
    .toString();

  useEffect(() => {
    if (selectedMyPosition) {
      reset();
      refetch();
    }
  }, [selectedMyPosition]);

  useEffect(() => {
    if (!chainId) closePopup(MyPositionDetailPopup);
  }, [chainId]);

  useEffect(() => {
    if (
      !selectedMyPosition?.farming &&
      !positionDetailLoading &&
      chainId === 8217
    )
      openPopup(StakePopup, {
        tokens: [
          {
            ...KRWO,
            amount: applyDecimals(
              positionDetail?.liquidity.token1.value || '0',
              KRWO.decimal,
            ),
          },
          {
            ...USDT,
            amount: applyDecimals(
              positionDetail?.liquidity.token0.value || '0',
              USDT.decimal[
                checkIsAvailableChain(chainId) ? chainId : defaultChain.id
              ],
            ),
          },
        ],
        totalLiquidity: totalAmount,
        tokenId: selectedMyPosition?.tokenId!,
      });
  }, [selectedMyPosition?.farming, positionDetailLoading]);

  const defaultFees = [
    {
      ...KRWO,
      amount: krwoFee,
      value: positionDetail?.fee.token1.value || '0',
    },
    {
      ...USDT,
      amount: usdtFeeInKRWO,
      value: positionDetail?.fee.token0.value || '0',
    },
  ];

  const fees = TOKEN_MAP[
    checkIsAvailableChain(chainId) ? chainId : defaultChain.id
  ].native.supportFarming
    ? [
        ...defaultFees,
        {
          ...TOKEN_MAP[
            checkIsAvailableChain(chainId) ? chainId : defaultChain.id
          ].reward,
          amount: nativeFee,
          value: positionDetail?.harvest.value || '0',
        },
      ]
    : defaultFees;

  return (
    <section className="max-lg:h-[95dvh] relative overflow-y-scroll scrollbar-hide">
      <h3 className="h3 font-bold w-fit">Liquidity</h3>
      <section className="mt-4 relative overflow-y-scroll scrollbar-hide max-lg:max-h-[calc(95dvh-94px)] pb-[94px]">
        <section className="flex flex-col gap-4">
          <PositionInfo
            isActive={!!selectedMyPosition?.active}
            isFarming={!!selectedMyPosition?.farming}
            apr={selectedMyPosition?.apr!}
            minTick={Math.floor(
              +usdtTickToKrw(
                selectedMyPosition?.liquidity.lowerTick || 0,
                chainId,
              ),
            )}
            maxTick={Math.floor(
              +usdtTickToKrw(
                selectedMyPosition?.liquidity.upperTick || 0,
                chainId,
              ),
            )}
            currentPrice={currentPrice}
          />
          <BarChartAndInfo
            title="Liquidity"
            tokens={[
              {
                ...KRWO,
                value: positionDetail?.liquidity.token1.value || '0',
                amount: krwoAmount,
                icon: KRWO.icon[chainId as ChainIdType],
                color: KRWO.color[chainId as ChainIdType],
              },
              {
                ...USDT,
                value: positionDetail?.liquidity.token0.value || '0',
                amount: usdtAmount,
                icon: USDT.icon,
                color: USDT.color,
              },
            ]}
          />
          <Harvest
            tokenId={selectedMyPosition?.tokenId!}
            usdt={{
              value: positionDetail?.fee.token0.value || '0',
              amount: usdtFeeInKRWO,
            }}
            krwo={{
              value: positionDetail?.fee.token1.value || '0',
              amount: krwoFee,
            }}
            native={{
              value: positionDetail?.harvest.value || '0',
              amount: nativeFee,
            }}
          />
          <Link
            className="flex flex-row items-center justify-center gap-1"
            href={`${SWAP_SERVICE_LINK[checkIsAvailableChain(chainId) ? chainId : defaultChain.id].link}/${selectedMyPosition?.tokenId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="font-bold text-purple-500 p1">
              {SWAP_SERVICE_LINK[
                checkIsAvailableChain(chainId) ? chainId : defaultChain.id
              ].title || ''}
            </p>
            <ChevronRightIcon className="w-5 h-5 stroke-purple-500" />
          </Link>
        </section>
      </section>
      <section className="flex flex-row gap-2 py-5 w-full bg-black-1">
        <Button
          className="z-10"
          color="secondary"
          size="xl"
          disabled={positionDetailLoading}
          onClick={() =>
            next(RemovePosition, {
              fees: fees,
              tokens: [
                {
                  ...KRWO,
                  amount: positionDetail?.liquidity.token1.value || '0',
                },
                {
                  ...USDT,
                  amount: positionDetail?.liquidity.token0.value || '0',
                },
              ],
              totalAmount,
              selectedMyPosition: selectedMyPosition!,
              totalLiquidity: positionDetail?.totalLiquidity || '0',
            })
          }
        >
          Remove
        </Button>
        <Button
          className="z-10"
          color="primary"
          size="xl"
          disabled={positionDetailLoading}
          onClick={() =>
            next(MyPositionAddLiquidityPopup, {
              selectedMyPosition: selectedMyPosition!,
              totalAmount,
              currentPrice,
            })
          }
        >
          Add
        </Button>
      </section>
    </section>
  );
}
