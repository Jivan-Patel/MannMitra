import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, BookOpen, Music, Feather, SmilePlus, Layers } from 'lucide-react';
import { useAllContent } from '../hooks/useContent';
import { ContentCard } from '../components/shared/ContentCard';
import { SkeletonCard } from '../components/shared/SkeletonCard';
import type { Category } from '../types/content';

interface CategoryConfig {
  id: Category;
  label: string;
  icon: typeof Activity;
  colorVar: string;
}

const CATEGORIES: CategoryConfig[] = [
  { id: 'yoga', label: 'Yoga & Movement', icon: Activity, colorVar: 'var(--cat-yoga)' },
  { id: 'books', label: 'Reading', icon: BookOpen, colorVar: 'var(--cat-book)' },
  { id: 'music', label: 'Music & Sounds', icon: Music, colorVar: 'var(--cat-music)' },
  { id: 'spiritual', label: 'Spiritual Wisdom', icon: Feather, colorVar: 'var(--cat-spiritual)' },
  { id: 'humor', label: 'Lighthearted & Humor', icon: SmilePlus, colorVar: 'var(--cat-humor)' }
];

export const BrowseAllPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { content, isLoading } = useAllContent();

  const selectedCategory = (searchParams.get('category')?.toLowerCase().trim() as Category | 'all') || 'all';

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [selectedCategory]);

  const handleSelectCategory = (catId: string) => {
    if (catId === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: catId });
    }
  };

  const displayedCategories = selectedCategory === 'all' || !CATEGORIES.some(c => c.id === selectedCategory)
    ? CATEGORIES
    : CATEGORIES.filter(c => c.id === selectedCategory);

  return (
    <div className="min-h-screen px-4 py-8 md:py-12 max-w-7xl mx-auto animate-fade-in-up pb-32">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-6 focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-lg px-2 py-1 -ml-2"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to home
      </button>

      <div className="mb-10">
        <div className="inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary font-semibold text-sm rounded-full mb-4">
          Library
        </div>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary">
          Explore all resources
        </h1>
        <p className="font-sans text-lg md:text-xl text-text-secondary mt-4 max-w-2xl">
          Browse our collection of peer-support content across all categories or filter by what you need right now.
        </p>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2.5 mt-8">
          <button
            type="button"
            onClick={() => handleSelectCategory('all')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-brand-primary text-white shadow-md'
                : 'bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-brand-primary/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>All Categories</span>
          </button>

          {CATEGORIES.map(({ id, label, icon: Icon, colorVar }) => {
            const isSelected = selectedCategory === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleSelectCategory(id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  isSelected
                    ? 'text-white shadow-md'
                    : 'bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-brand-primary/50'
                }`}
                style={isSelected ? { backgroundColor: colorVar } : {}}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-16">
        {displayedCategories.map(({ id, label, icon: Icon, colorVar }) => {
          const items = content?.[id] || [];

          return (
            <section key={id} id={id} className="scroll-mt-24">
              <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm"
                    style={{ backgroundColor: colorVar }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl font-semibold text-text-primary">
                    {label}
                  </h2>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-surface-alt border border-border text-text-secondary">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {selectedCategory !== 'all' && (
                  <button
                    type="button"
                    onClick={() => handleSelectCategory('all')}
                    className="text-xs font-semibold text-brand-primary hover:underline"
                  >
                    Show all categories
                  </button>
                )}
              </div>

              {isLoading ? (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              ) : items.length > 0 ? (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
                  {items.map((item) => (
                    <div key={item.id} className={`${items.length === 1 ? 'md:col-span-2 lg:col-span-2 max-w-2xl' : ''}`}>
                      <ContentCard item={item} category={id} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-secondary font-sans text-sm">No content available for this category.</p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};
