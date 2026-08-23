import type React from 'react';
import { Heart, Activity, BookOpen, Music, Feather, SmilePlus, Quote, Clock, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { ContentItem, Category } from '../../types/content';

interface Props {
  item: ContentItem;
  category: Category;
}

const CATEGORY_MAP: Record<Category, { label: string; icon: React.FC<any>; colorClass: string; borderVar: string }> = {
  yoga: { label: 'Yoga & Movement', icon: Activity, colorClass: 'text-[var(--cat-yoga)] bg-[var(--cat-yoga)]/10', borderVar: 'var(--cat-yoga)' },
  books: { label: 'Reading', icon: BookOpen, colorClass: 'text-[var(--cat-book)] bg-[var(--cat-book)]/10', borderVar: 'var(--cat-book)' },
  music: { label: 'Music & Sounds', icon: Music, colorClass: 'text-[var(--cat-music)] bg-[var(--cat-music)]/10', borderVar: 'var(--cat-music)' },
  spiritual: { label: 'Spiritual Wisdom', icon: Feather, colorClass: 'text-[var(--cat-spiritual)] bg-[var(--cat-spiritual)]/10', borderVar: 'var(--cat-spiritual)' },
  humor: { label: 'Lighthearted', icon: SmilePlus, colorClass: 'text-[var(--cat-humor)] bg-[var(--cat-humor)]/10', borderVar: 'var(--cat-humor)' },
};

export const ContentCard: React.FC<Props> = ({ item, category }) => {
  const { favorites, toggleFavorite } = useAppStore();
  const isFav = favorites.includes(item.id);
  const catDetails = CATEGORY_MAP[category];
  const Icon = catDetails.icon;
  const isSpiritual = category === 'spiritual' && 'text' in item;

  return (
    <div
      className="bg-surface rounded-2xl shadow-sm dark:border dark:border-border hover:shadow-md transition-shadow flex flex-col justify-between h-full overflow-hidden"
      style={{ borderTop: `6px solid ${catDetails.borderVar}` }}
    >
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-5 gap-2">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${catDetails.colorClass}`}>
            <Icon className="w-3.5 h-3.5" />
            <span>{catDetails.label}</span>
          </div>

          <button
            onClick={() => toggleFavorite(item.id)}
            className="p-1.5 -mr-1.5 -mt-1.5 shrink-0 rounded-full hover:bg-surface-alt transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-5 h-5 ${isFav ? 'fill-brand-accent text-brand-accent' : 'text-text-secondary'}`} />
          </button>
        </div>

        {isSpiritual ? (
          <div className="flex-1 flex flex-col justify-center relative py-2">
            <Quote className="absolute top-0 left-0 w-12 h-12 -translate-x-3 -translate-y-2 opacity-10 text-[var(--cat-spiritual)]" />
            <p className="font-display text-2xl md:text-3xl font-medium text-text-primary mb-3 leading-snug relative z-10">
              "{'text' in item ? item.text : ''}"
            </p>
            {'source' in item && <p className="text-[15px] font-semibold text-text-secondary">— {item.source}</p>}
          </div>
        ) : (
          <div className="flex-1">
            <h3 className="font-display text-xl md:text-2xl font-bold text-text-primary mb-2 leading-snug">
              {'title' in item ? item.title : ''}
            </h3>
            {'author' in item && item.author && (
              <p className="text-[15px] text-text-secondary mb-2">
                by <span className="font-semibold text-text-primary">{item.author}</span>
              </p>
            )}
          </div>
        )}

        {item.description && (
          <p className="text-sm text-text-secondary leading-relaxed mt-3">{item.description}</p>
        )}

        {item.whyRecommended && (
          <div className="flex items-start gap-2 text-sm text-text-secondary italic mt-3 bg-surface-alt/70 p-3 rounded-xl border-l-[3px]" style={{ borderColor: catDetails.borderVar }}>
            <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: catDetails.borderVar }} />
            <span>{item.whyRecommended}</span>
          </div>
        )}

        {(item.duration || item.tags?.length) && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {item.duration && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-text-secondary bg-surface-alt px-2.5 py-1 rounded-full">
                <Clock className="w-3 h-3" />
                {item.duration}
              </span>
            )}
            {item.tags?.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs font-medium text-text-secondary/80 bg-surface-alt px-2.5 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {item.url && (
        <div className="bg-surface-alt/60 px-6 py-4 border-t border-border mt-auto flex items-center justify-between gap-2">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-brand-primary font-bold hover:text-brand-primary-hover focus:outline-none hover:underline"
          >
            View Source &rarr;
          </a>
          {item.source && <span className="text-xs text-text-secondary/70 truncate max-w-[45%]">{item.source}</span>}
        </div>
      )}
    </div>
  );
};
