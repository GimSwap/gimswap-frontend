import Button from '@/src/components/Button';
import PopupTemplate from '@/src/components/PopupTemplate';

interface GuidePopupProps {
  open: boolean;
  onClose: () => void;
  title: string;
  step: {
    subtitle: string;
    description?: string;
  }[];
}

export default function GuidePopup({
  open,
  onClose,
  title,
  step,
}: GuidePopupProps) {
  return (
    <PopupTemplate
      open={open}
      onClose={onClose}
      showCloseButton
      closeButtonStyle="absolute top-9 right-6"
    >
      <section className="px-6">
        <section className="flex flex-col gap-4">
          <h3 className="font-bold">{title}</h3>
          {step.map((step, index) => {
            return (
              <div key={index} className="flex flex-row gap-2 items-start">
                <p className="w-5 h-[20px] rounded-full bg-black-5 flex items-center justify-center text-black-1 flex-shrink-0">
                  {index + 1}
                </p>
                <div className="flex flex-col gap-1">
                  <p className="p1 font-medium">{step.subtitle}</p>
                  {step.description && (
                    <p className="c1 text-black-8">{step.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </section>
        <Button size="xl" color="primary" className="my-5" onClick={onClose}>
          확인
        </Button>
      </section>
    </PopupTemplate>
  );
}
