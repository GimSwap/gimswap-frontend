'use client';

import { useEffect, useState } from 'react';
import MyPosition from './MyPosition';
import ChevronDown from '@/public/svg/chevron/right.svg';
import NoPosition from './NoPosition';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import MyPositionDetailPopup from './MyPositionDetailPopup';
import { useLiquidityStore } from '@/src/lib/stores/liquidityStore/LiquidityStoreProvider';
import { GetMyPositionsResponseType } from '@/src/lib/types/api/liquidity/GetPositionType';
import { useQueries } from '@tanstack/react-query';
import { fetchGetCurrentTick } from '@/src/lib/utils/api/liquidity/fetchGetCurrentTick';
import { applyDecimals, usdtTickToKrw } from '@/src/lib/utils/calcTick';
import { useAccount } from 'wagmi';
import { fetchGetMyPositions } from '@/src/lib/utils/api/liquidity/fetchGetMyPositions';
import { fetchGetFee } from '@/src/lib/utils/api/liquidity/fetchGetFee';
import { GetCurrentTickResponseType } from '@/src/lib/types/api/liquidity/GetCurrentTickType';
import { safeCalc } from '@/src/lib/utils/safeCalc';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { GetFeeResponseType } from '@/src/lib/types/api/liquidity/GetFeeType';
import RefreshIcon from './RefreshIcon';

const ITEMS_PER_CLICK = 3;

export default function MyPositions() {
  const [index, setIndex] = useState(0);
  const [previousTick, setPreviousTick] = useState(0);

  const { address } = useAccount();
  const { openPopup } = usePopupStore((state) => state);
  const {
    selectedMyPosition,
    setSelectedMyPosition,
    setCurrentPrice,
    setOptimisticPositions,
    optimisticPositions,
    setRefetchPositions,
  } = useLiquidityStore((state) => state);

  const [
    { data: currentTick, isPending: isPendingCurrentTick },
    {
      data: _positions,
      refetch: refetchPositions,
      isLoading: isLoadingPositions,
    },
  ] = useQueries({
    queries: [
      {
        queryKey: ['currentTick'],
        queryFn: () =>
          fetchGetCurrentTick({
            chainId: 8217,
            token: 'usdt',
          }),
        refetchInterval: 5000,
        select: (data: GetCurrentTickResponseType) => data.currentTick,
      },
      {
        queryKey: ['myPositions', address],
        queryFn: () => fetchGetMyPositions(8217, address!),
        select: (data: GetMyPositionsResponseType) => data.positions,
        enabled: !!address,
      },
    ],
  });

  const [...positions] = useQueries({
    queries:
      _positions?.map((position) => ({
        queryKey: ['fee', position.tokenId],
        queryFn: () =>
          fetchGetFee({ chainId: 8217, tokenId: position.tokenId }),
        enabled: !!_positions,
        refetchInterval: 5000,
        select: (data: GetFeeResponseType) => ({
          ...position,
          fee: {
            usdtFee: safeCalc
              .multiply(
                +usdtTickToKrw(currentTick || 0),
                applyDecimals(data.amount0 || 0, 6, 10),
              )
              .toFixed(),
            krwoFee: applyDecimals(data.amount1 || 0, 6, 10),
          },
        }),
      })) || [],
  });

  const currentPrice = +usdtTickToKrw(currentTick!);
  const positionLength = positions?.length || 0;

  const handleMoreButtonClick = () => {
    if (index === positionLength) {
      setIndex(ITEMS_PER_CLICK);
    } else {
      setIndex(Math.min(index + ITEMS_PER_CLICK, positionLength));
    }
  };

  useEffect(() => {
    !isPendingCurrentTick && setCurrentPrice(currentPrice);
    if (Math.floor(currentPrice / 40) !== Math.floor(previousTick / 40)) {
      setPreviousTick(currentPrice);
      previousTick !== 0 && refetchPositions();
    }
  }, [currentTick, isPendingCurrentTick]);

  useEffect(() => {
    setIndex(Math.min(ITEMS_PER_CLICK, positionLength));
    if (positions.every((position) => position.isSuccess)) {
      setOptimisticPositions(
        positions.map((position) => ({
          ...position.data,
          refetchFee: position.refetch,
        })),
      );
      setRefetchPositions(refetchPositions);
    }
  }, [
    positionLength,
    positions.every((position) => position.isSuccess),
    _positions,
  ]);

  if (isLoadingPositions || positions.some((data) => data.isPending))
    return (
      <div className="w-full min-h-[150px] grid place-items-center">
        <LoadingSpinner />
      </div>
    );
  return (
    <>
      <RefreshIcon refetch={() => refetchPositions()} />
      <section>
        {optimisticPositions.length > 0 ? (
          optimisticPositions?.slice(0, index).map((position) => {
            return (
              <div
                key={position.tokenId}
                onClick={() => {
                  setSelectedMyPosition(position);
                  openPopup(MyPositionDetailPopup, undefined, true);
                }}
              >
                <MyPosition
                  position={position}
                  isSelected={selectedMyPosition?.tokenId === position.tokenId}
                  currentPrice={currentPrice}
                />
              </div>
            );
          })
        ) : (
          <NoPosition />
        )}
        {positionLength > 3 ? (
          <div
            className="flex flex-row items-center justify-center cursor-pointer gap-1 w-fit pt-4 mx-auto"
            onClick={handleMoreButtonClick}
          >
            <span className="font-bold text-purple-500">
              {index < positionLength ? 'More' : 'Fold'}
            </span>
            <ChevronDown
              className={`stroke-purple-500 ${
                index < positionLength ? 'rotate-90' : '-rotate-90'
              }`}
            />
          </div>
        ) : null}
      </section>
    </>
  );
}
