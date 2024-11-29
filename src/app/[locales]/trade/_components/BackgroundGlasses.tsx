export default function BackgroundGlasses() {
  return (
    <div className="absolute w-full left-1/2 -translate-x-1/2 bottom-1/2 translate-y-1/2">
      <div className="max-w-[480px] lg:max-w-[100vw] m-[0_auto] relative">
        <div className="bg-glass h-[calc(100dvh-160px)]" />
      </div>
      <div className="bg-[linear-gradient(180deg,rgba(252,252,252,0.00)_0%,#FCFCFC_75.68%)] h-[200px] absolute w-full bottom-[-30px]" />
      <div className="hidden lg:block lg:bg-[linear-gradient(0deg,rgba(252,252,252,0.00)_0%,#FCFCFC_75.68%)] h-[500px] absolute w-full top-[0px]" />
    </div>
  );
}
