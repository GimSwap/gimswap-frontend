interface LoadingSpinnerProps {
  className?: string;
}

export default function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <div
      className={`animate-spin inline-block size-6 border-[3px] border-purple-500 rounded-full dark:border-purple-500 ${className}`}
      style={{ borderTopColor: '#ffffff' }}
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
