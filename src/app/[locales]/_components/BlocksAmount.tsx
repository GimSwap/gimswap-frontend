import ExchangeIcon from '@/public/svg/exchange.svg';
import { insertComma } from '@/src/lib/utils/insertComma';
import { KRWO, OPEN_VOUCHER } from '@/src/lib/constants/token';
import Image from 'next/image';
import totalSupplyAbi from '@/src/lib/utils/abis/getTotalSupplyAbi.json';
import { CONTRACT_ADDRESS } from '@/src/lib/constants/contractAddress';
import { createPublicClient, formatUnits } from 'viem';
import { kaia } from 'wagmi/chains';
import { http } from 'wagmi';
import getBalanceAbi from '@/src/lib/utils/abis/getERC20Balance.json';

export default async function BlocksAmount() {
  const client = createPublicClient({
    chain: kaia,
    transport: http(kaia.rpcUrls.default.http[0]),
  });

  const [totalSupply, balance] = await Promise.all([
    (await client.readContract({
      abi: totalSupplyAbi,
      address: CONTRACT_ADDRESS.KRWO as `0x${string}`,
      functionName: 'totalSupply',
    })) as bigint,
    (await client.readContract({
      abi: getBalanceAbi,
      address: CONTRACT_ADDRESS.OpenVoucher as `0x${string}`,
      functionName: 'balanceOf',
      args: [CONTRACT_ADDRESS.GimSwap],
    })) as bigint,
  ]);

  const lockedOpenVoucher = formatUnits(balance, OPEN_VOUCHER.decimal);
  const KRWOTotalSupply = formatUnits(totalSupply, KRWO.decimal);

  return (
    <section className="py-10 px-4 bg-black-13 flex flex-col items-center w-full">
      <div className="relative flex flex-col lg:flex-row gap-2 max-w-[1008px] w-full">
        <div className="rounded-2xl border border-purple-200 p-6 flex flex-col gap-1 bg-[rgba(255,255,255,0.1)] flex-1 lg:items-center">
          <p className="p1 text-black-1">Locked Open Voucher</p>
          <h3 className="font-bold text-black-1">
            {insertComma(lockedOpenVoucher)} OV
          </h3>
        </div>
        <div className="rounded-2xl border border-purple-200 p-6 flex flex-col gap-1 bg-[rgba(255,255,255,0.1)] flex-1 lg:items-center">
          <p className="p1 text-black-1">KRWO total supply</p>
          <h3 className="font-bold text-black-1">
            {insertComma(KRWOTotalSupply)} KRWO
          </h3>
        </div>
        <ExchangeIcon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="my-4 py-4 px-6 bg-[rgba(255,255,255,0.1)] rounded-2xl flex justify-center max-w-[1008px] w-full">
        <Image
          src={OPEN_VOUCHER.imageUrl}
          width={20}
          height={20}
          alt="openvoucher"
        />
        <h5 className="text-black-1 ml-1">1 OV</h5>
        <h5 className="mx-2 text-black-1">=</h5>
        <Image src={KRWO.imageUrl} width={20} height={20} alt="KRWO" />
        <h5 className="text-black-1 ml-1">10,000 KRWO</h5>
      </div>
    </section>
  );
}
