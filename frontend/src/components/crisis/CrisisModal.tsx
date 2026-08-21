import { useEffect } from 'react';
import { X, Phone, ExternalLink } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { fetchCrisisResources } from '../../services/contentService';

const crisisData = fetchCrisisResources();

export const CrisisModal = () => {
  const { isCrisisModalOpen, closeCrisisModal } = useAppStore();

  useEffect(() => {
    if (!isCrisisModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCrisisModal();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isCrisisModalOpen, closeCrisisModal]);

  if (!isCrisisModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in-up"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crisis-modal-title"
      onClick={closeCrisisModal}
    >
      <div
        className="bg-surface border border-border rounded-3xl shadow-lg max-w-lg w-full max-h-[85vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-danger text-white p-5 md:p-6 rounded-t-3xl flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Phone className="w-5 h-5 animate-pulse-slow flex-shrink-0" />
            <h2 id="crisis-modal-title" className="font-display text-xl md:text-2xl font-bold">
              {crisisData?.title ?? 'Need Immediate Support?'}
            </h2>
          </div>
          <button
            onClick={closeCrisisModal}
            aria-label="Close crisis resources"
            className="p-1.5 -mr-1.5 -mt-1 rounded-full hover:bg-white/20 transition-colors flex-shrink-0 focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 md:p-6">
          <p className="text-sm font-sans text-text-secondary mb-6 leading-relaxed">
            {crisisData?.disclaimer}
          </p>

          <div className="space-y-3">
            {crisisData?.resources.map((resource) => (
              <div
                key={resource.id}
                className="bg-surface-alt/70 border border-border rounded-2xl p-4 flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-display font-bold text-text-primary">{resource.name}</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-primary/10 text-brand-primary">
                    {resource.availability}
                  </span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{resource.description}</p>
                <div className="flex items-center justify-between gap-2 flex-wrap mt-1.5">
                  <a
                    href={`tel:${resource.contact.replace(/[^\d+]/g, '')}`}
                    className="font-bold text-brand-primary hover:text-brand-primary-hover text-[15px]"
                  >
                    {resource.contact}
                  </a>
                  <a
                    href={resource.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Official site <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
