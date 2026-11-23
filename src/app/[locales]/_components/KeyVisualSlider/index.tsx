import DesktopSlider from '@/src/app/[locales]/_components/KeyVisualSlider/components/DesktopSlider';
import MobileSlider from '@/src/app/[locales]/_components/KeyVisualSlider/components/MobileSlider';

export default function KeyVisualSlider() {
  return (
    <section>
      <div className="hidden lg:block">
        <DesktopSlider />
      </div>
      <div className="block lg:hidden">
        <MobileSlider />
      </div>
    </section>
  );
}
