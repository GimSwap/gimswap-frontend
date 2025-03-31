import {
  GetSwapRouteRequestType,
  GetSwapRouteResponseType,
} from '@/src/lib/types/api/swap/GetSwapRouteType';
import { Fetch } from '../fetchClient';
import { snakeCase } from 'change-case';

export const fetchGetSwapRoute = async (
  params: GetSwapRouteRequestType,
): Promise<GetSwapRouteResponseType | undefined> => {
  if (Number(params.amount) <= 0) return undefined;

  const queryParams = Object.entries(params)
    .map(([key, value]) => `${snakeCase(key)}=${value}`)
    .join('&');

  return Fetch(`/swap/route?${queryParams}`);
};
