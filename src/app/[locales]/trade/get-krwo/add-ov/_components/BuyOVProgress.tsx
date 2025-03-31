'use client';

import { usePathname } from '@/src/i18n/routing';
import { ObjectKeys } from '@/src/lib/utils/typeSafe/keys';

const STEPS = {
  'buy-ov': 'Buy OV',
  'krwo-swap': 'KRWO Swap',
  completed: 'Completed',
};

const STEPS_LENGTH = ObjectKeys(STEPS).length;

export default function BuyOVProgress() {
  const pathname = usePathname();
  const currentStep = pathname.split('/').pop() as keyof typeof STEPS;
  const currentStepIndex = ObjectKeys(STEPS).indexOf(currentStep);
  return (
    <section className="relative pt-6 pb-4">
      <div className="mx-7 relative mb-2">
        <div
          className="h-[1.5px]"
          style={{
            background: `linear-gradient(90deg, #CDBBFF ${
              (currentStepIndex / (STEPS_LENGTH - 1)) * 100
            }%, #F0F0F0 100%)`,
          }}
        />
        <section className="absolute w-full h-full flex items-center justify-between top-1/2 -translate-y-1/2">
          {ObjectKeys(STEPS).map((step, index) => (
            <div className="relative" key={step}>
              {index === currentStepIndex && (
                <div className="-translate-x-[5px] -translate-y-[5px] relative">
                  <div className="absolute w-[18px] h-[18px] animate-pulse-gradient" />
                </div>
              )}
              <div
                className={`w-2 h-[8px] rounded-full ${
                  index <= currentStepIndex
                    ? 'bg-purple-500'
                    : 'bg-black-1 border-2 border-black-5'
                }`}
              />
            </div>
          ))}
        </section>
      </div>
      <section className="flex items-center w-full justify-between">
        {ObjectKeys(STEPS).map((step) => (
          <p key={step} className="c1 text-black-8 text-center min-w-[66px]">
            {STEPS[step]}
          </p>
        ))}
      </section>
    </section>
  );
}
