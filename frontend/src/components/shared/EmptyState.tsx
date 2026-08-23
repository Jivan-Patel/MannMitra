import type React from 'react';
import type { Category } from '../../types/content';

export const EmptyState: React.FC<{ category: Category }> = ({ category }) => {
  return (
    <div className="bg-surface-alt/50 border border-border border-dashed rounded-2xl p-8 text-center text-text-secondary h-full flex flex-col items-center justify-center min-h-[160px]">
      <p className="font-sans text-sm">
        We're still curating {category} resources for this mood. 
        Take a deep breath and check back later.
      </p>
    </div>
  );
};
