interface BarChartProps {
  symbols: {
    symbol: string;
    percentage: number;
    color: string;
  }[];
  isInActive?: boolean;
}

export default function BarChart({
  symbols,
  isInActive = false,
}: BarChartProps) {
  return (
    <>
      {isInActive ? (
        <div className="w-full rounded-full overflow-hidden h-[8px] bg-black-4" />
      ) : (
        <section className="w-full rounded-full overflow-hidden h-[8px] flex flex-row">
          {symbols.map((symbol) => (
            <div
              style={{ flex: symbol.percentage, backgroundColor: symbol.color }}
              key={symbol.symbol}
            />
          ))}
        </section>
      )}
      <div className="pt-1 flex flex-row justify-between">
        {symbols.map((symbol) => (
          <div className="flex flex-row items-center gap-1" key={symbol.symbol}>
            <div
              style={{ backgroundColor: symbol.color }}
              className="w-2 h-[8px] rounded-sm"
            />
            <p className="c0 text-black-7">
              {symbol.symbol} {Math.floor(symbol.percentage * 100)}%
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
