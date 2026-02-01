
export enum AgeRange {
  A4_6 = '4-6',
  A7_9 = '7-9',
  A9_11 = '9-11'
}

export enum Genre {
  ADVENTURE = 'Adventure',
  MORAL = 'Moral Story',
  LEARNING = 'Learning-based',
  FANTASY = 'Fantasy'
}

export interface Character {
  id: string;
  description: string;
  imageUrl: string;
  isLocked: boolean;
}

export interface BookPage {
  id: string;
  textPrimary: string;
  textSecondary?: string;
  imageUrl: string;
  layout: 'image-left' | 'image-right' | 'full-image-text-overlay';
}

export interface Book {
  id: string;
  title: string;
  ageRange: AgeRange;
  genre: Genre;
  primaryLanguage: string;
  secondaryLanguage?: string;
  character: Character | null;
  pages: BookPage[];
}

export interface Worksheet {
  id: string;
  bookId: string;
  title: string;
  content: {
    comprehension: string[];
    vocabulary: string[];
    writingPrompt: string;
  };
}
