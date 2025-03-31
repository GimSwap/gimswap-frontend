import Button from '@/src/components/Button';
import PopupTemplate from '@/src/components/PopupTemplate';

interface GetNetworkFeePopupProps {
  open: boolean;
  onClose: () => void;
  serviceFee: string;
  onApply: () => void;
}

export default function GetNetworkFeePopup({
  open,
  onClose,
  serviceFee,
  onApply,
}: GetNetworkFeePopupProps) {
  return (
    <PopupTemplate open={open} onClose={onClose} icon="alert" showCloseButton>
      <section className="flex flex-col justify-center items-center gap-4 pb-5 px-6">
        <h3 className="font-bold">Get network fees as well</h3>
        <h5 className="text-black-8 font-medium text-center">
          Currently, the network fee is insufficient.We help you exchange
          without manually calculating the fee for KRWO and OV.
        </h5>
        <section className="bg-black-3 flex flex-row justify-between py-3 px-4 rounded-lg w-full">
          <p className="p1 text-black-8">Applicable fee</p>
          <p className="p1 font-bold text-black-8">₩ {serviceFee}</p>
        </section>
      </section>
      <section className="flex flex-row px-6 gap-2 py-5">
        <Button size="xl" color="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button size="xl" color="primary" onClick={onApply}>
          Apply
        </Button>
      </section>
    </PopupTemplate>
  );
}
