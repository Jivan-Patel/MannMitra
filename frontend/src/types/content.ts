export type Mood = 'anxious' | 'low' | 'depressed' | 'stressed' | 'lonely' | 'wants_humor' | 'neutral';

export type Category = 'yoga' | 'books' | 'music' | 'spiritual' | 'humor';

export type Effort = 'low' | 'medium' | 'high';

export interface BaseItem {
  id: string;
  type: Category;
  title?: string;
  description?: string;
  whyRecommended?: string;
  effort?: Effort;
  duration?: string;
  source?: string;
  url?: string;
  verificationSource?: string;
  lastVerified?: string;
  tags?: string[];
}

export interface YogaItem extends BaseItem {
  type: 'yoga';
  title: string;
}

export interface BookItem extends BaseItem {
  type: 'books';
  title: string;
  author: string;
}

export interface MusicItem extends BaseItem {
  type: 'music';
  title: string;
}

export interface SpiritualItem extends BaseItem {
  type: 'spiritual';
  text: string;
  source: string;
  contentKind?: string;
}

export interface HumorItem extends BaseItem {
  type: 'humor';
  title: string;
}

export type ContentItem = YogaItem | BookItem | MusicItem | SpiritualItem | HumorItem;

export interface MoodContent {
  yoga?: ContentItem[];
  books?: ContentItem[];
  music?: ContentItem[];
  spiritual?: ContentItem[];
  humor?: ContentItem[];
}

export interface StartHere {
  title: string;
  description: string;
  instruction: string;
  duration: string;
  actionType: string;
}

export interface MoodEntry {
  id: string;
  label: string;
  description: string;
  startHere?: StartHere;
  content: MoodContent;
}

export interface ContentDataset {
  moods: Record<string, MoodEntry>;
}

export interface CrisisResource {
  id: string;
  name: string;
  contact: string;
  type: string;
  availability: string;
  description: string;
  officialUrl: string;
  verificationSource: string;
  lastVerified: string;
}

export interface CrisisResourcesData {
  title: string;
  disclaimer: string;
  resources: CrisisResource[];
}
