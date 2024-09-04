import Button from "../Button";
import PopupTemplate from "../PopupTemplate";

interface SwapErrorPopupProps {
  open: boolean;
  onClose: () => void;
}

export default function SwapErrorPopup({ open, onClose }: SwapErrorPopupProps) {
  return (
    <PopupTemplate showCloseButton open={open} onClose={onClose} icon="error">
      <section className="px-6">
        <h3 className="font-bold text-center pb-4">Swap failed</h3>
        <h5 className="font-medium text-black-8 text-center mb-5">
          The swap failed because a service error occurred. Please try again.
        </h5>
        <Button
          title="Confirm"
          className="text-black-1 bg-purple-500 my-5"
          onClick={onClose}
        />
      </section>
    </PopupTemplate>
  );
}
