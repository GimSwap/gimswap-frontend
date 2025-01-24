interface BarChartProps {
  symbols: {
    symbol: string;
    percentage: number;
    color: string;
  }[];
  isInActive?: boolean;
  symbolStyle?: {
    showPercentage?: boolean;
    className?: string;
  };
}

export default function BarChart({
  symbols,
  isInActive = false,
  symbolStyle = {
    showPercentage: true,
    className: '',
  },
}: BarChartProps) {
  const symbolText = (symbol: string, percentage: number) => {
    if (!symbolStyle?.showPercentage) return symbol;
    if (isInActive) return `${symbol} -`;
    return `${symbol} ${Math.floor(percentage * 100)}%`;
  };

  return (
    <>
      {isInActive ? (
        <div className="w-full rounded-full overflow-hidden h-[8px] bg-black-4" />
      ) : (
        <section className="w-full rounded-full overflow-hidden h-[8px] flex flex-row">
          {symbols.map((symbol, index) => (
            <div
              style={{ flex: symbol.percentage, backgroundColor: symbol.color }}
              key={symbol.symbol + index}
            />
          ))}
        </section>
      )}
      <div
        className={`pt-1 flex flex-row justify-between ${
          symbolStyle?.className || ''
        }`}
      >
        {symbols.map((symbol, index) => (
          <div
            className="flex flex-row items-center gap-1"
            key={symbol.symbol + index}
          >
            <div
              style={{ backgroundColor: symbol.color }}
              className="w-2 h-[8px] rounded-full"
            />
            <p className="c0 text-black-7">
              {symbolText(symbol.symbol, symbol.percentage)}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
