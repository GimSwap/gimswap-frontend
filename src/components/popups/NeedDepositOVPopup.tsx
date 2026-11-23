import Button from '../Button';
import PopupTemplate from '../PopupTemplate';

interface NeedDepositOVPopupProps {
  open: boolean;
  onClose: () => void;
}

export default function NeedDepositOVPopup({
  open,
  onClose,
}: NeedDepositOVPopupProps) {
  return (
    <PopupTemplate open={open} onClose={onClose} icon="alert" showCloseButton>
      <section className="px-6 flex flex-col items-center">
        <h3 className="font-bold pt-4">Buy Open Voucher Directly</h3>
        <h5 className="font-medium pt-2 pb-5 text-center">
          Your Open Voucher balance is empty.
          <br />
          Buy Open Voucher to earn KRWO.
        </h5>
        <section className="py-5 flex flex-row gap-2 w-full">
          <Button color="secondary" size="xl" onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" size="xl" href="/trade/buy">
            Buy
          </Button>
        </section>
      </section>
    </PopupTemplate>
  );
}
