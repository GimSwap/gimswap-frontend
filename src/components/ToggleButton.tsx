interface ToggleButtonProps {
  isActive: boolean;
  onClick: () => void;
}

export default function ToggleButton({ isActive, onClick }: ToggleButtonProps) {
  return (
    <div
      className={`w-9 h-[20px] p-[2px] rounded-full bg-${
        isActive ? 'purple-500' : 'black-5'
      } relative cursor-pointer`}
      onClick={onClick}
    >
      <div
        className={`w-4 h-[16px] rounded-full bg-black-1 absolute top-1/2 -translate-y-1/2 transition-transform duration-300 ${
          isActive ? 'translate-x-full' : 'translate-x-0'
        }`}
      />
    </div>
  );
}
