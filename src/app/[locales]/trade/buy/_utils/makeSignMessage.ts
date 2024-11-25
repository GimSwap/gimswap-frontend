import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const makeSignMessage = (walletAddress: `0x${string}` | undefined) => {
  if (!walletAddress) return null;
  if (!process.env.NEXT_PUBLIC_OV_PAYMENT_SIGN_MESSAGE)
    throw new Error('OV_PAYMENT_SIGN_MESSAGE is not defined');
  return process.env
    .NEXT_PUBLIC_OV_PAYMENT_SIGN_MESSAGE!.replace(
      '{walletAddress}',
      walletAddress,
    )
    .replace(
      '{date}',
      dayjs().tz('Asia/Seoul').add(1, 'minute').format('YYYY-MM-DDTHH:mm:ssZ'),
    );
};
