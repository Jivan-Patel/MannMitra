
export const SkeletonCard = () => {
  return (
    <div className="bg-surface rounded-2xl p-5 shadow-sm dark:border dark:border-border h-40 animate-pulse-slow flex flex-col justify-between">
      <div>
        <div className="h-6 bg-surface-alt rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-surface-alt rounded w-1/2 mb-2"></div>
      </div>
      <div className="h-4 bg-surface-alt rounded w-1/4"></div>
    </div>
  );
};
