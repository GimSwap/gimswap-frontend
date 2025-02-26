interface StepProps {
  step: string;
  title: string;
  description: string;
  isLast?: boolean;
}

export default function Step({
  step,
  title,
  description,
  isLast = false,
}: StepProps) {
  return (
    <section className="flex flex-row gap-3">
      <div
        className={`flex flex-col gap-1 items-center py-[2px] ${
          isLast ? 'justify-start' : 'justify-center'
        }`}
      >
        <div className="p1 font-medium text-black-1 rounded-full bg-purple-500 grid place-items-center w-5 h-5">
          {step}
        </div>
        {!isLast && <div className="w-[1px] h-[32px] bg-black-5" />}
      </div>
      <div className="flex flex-col gap-[2px]">
        <h5 className="font-medium">{title}</h5>
        <p className="p1 text-black-7">{description}</p>
      </div>
    </section>
  );
}
