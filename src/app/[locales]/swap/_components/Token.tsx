import { OPEN_VOUCHER, TOT } from "@/src/lib/constants/token";
import { getBalance } from "@/src/lib/hook/useGetBalance";

interface TokenProps {
  type: "pay" | "receive";
  amount: number;
  setAmount?: React.Dispatch<React.SetStateAction<number>>;
  token: typeof OPEN_VOUCHER | typeof TOT;
  isWritable: boolean;
  setIsEnoughBalance?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Token({
  type,
  amount,
  setAmount,
  token,
  isWritable,
  setIsEnoughBalance,
}: TokenProps) {
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!setAmount) return;
    const value = Number(e.target.value.replace(/,/g, ""));
    if (isNaN(value)) return;

    if (balance) {
      setIsEnoughBalance?.(Number(balance) >= value);
    }
    setAmount(value * token.unit);
  };

  const { balance } = getBalance({
    contractAddress: token.contractAddress,
    decimal: token.decimal,
  });

  const handleMaxButton = () => {
    setAmount && setAmount(Number(balance) * token.unit);
  };

  return (
    <section
      className={`rounded-lg bg-black-3 p-4 ${
        isWritable && "border border-[#137EFC]"
      }`}
    >
      <section className="flex justify-between pb-1 cursor-pointer">
        <p className="c1 font-medium">
          {type === "pay" ? "You pay" : "You receive"}
        </p>
        <div className="py-[6px] px-2 bg-black-1 rounded-full shadow-[0px_0px_5px_0px_rgba(0,0,0,0.08)] flex gap-1 items-center">
          <token.icon />
          <p className="c1 font-medium">{token.name}</p>
        </div>
      </section>
      <p className="c0 text-end text-black-8">
        Balance:
        {` ${Number(balance).toLocaleString("ko-kr", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 14,
        })}` || "0.0"}
        {type === "pay" && (
          <span
            className="c0 font-medium cursor-pointer text-purple-500 ml-1"
            onClick={handleMaxButton}
          >
            MAX
          </span>
        )}
      </p>
      <div className="mb-[2px]">
        {isWritable ? (
          <input
            type="tel"
            value={(amount / token.unit).toLocaleString("ko-kr") || ""}
            className="font-bold text-h2 w-full"
            onChange={handleInput}
          />
        ) : (
          <h2 className="font-bold text-black-6 overflow-hidden">
            {amount.toLocaleString("ko-kr")}
          </h2>
        )}
      </div>
      <p className={`c1 ${!isWritable && "text-black-6"}`}>
        ₩ {amount.toLocaleString("ko-kr")}
      </p>
    </section>
  );
}
