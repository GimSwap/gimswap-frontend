export default function LoadingSpinner() {
  return (
    <div
      className="animate-spin inline-block size-6 border-[3px] border-purple-500 rounded-full dark:border-purple-500 w-6 h-6"
      style={{ borderTopColor: '#ffffff' }}
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
