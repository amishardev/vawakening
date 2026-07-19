
import type { ReactNode } from 'react';
// Note: IconName and the static 'programs' array are being deprecated in favor of DB driven data.
// The Program type here will be replaced by ProgramDocument/ProgramDisplay from src/types/program.ts

export type IconName_DEPRECATED =
  | 'OmSymbol'
  | 'Users'
  | 'Leaf'
  | 'Zap'
  | 'BookOpen'
  | 'FileText'
  | 'Mic'
  | 'Film'
  | 'HandHelping';

export interface Program_DEPRECATED {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  iconName?: IconName_DEPRECATED | string;
  icon?: ReactNode;
  image: string;
  category: string;
  dataAiHint?: string;
  learnMoreUrl?: string;
  tags?: string[];
  language?: string;
}

// The 'programs' array below is now DEPRECATED for the live /programs page.
// It is kept here for reference only.
// The public /programs page now fetches data directly from Firestore.
export const programs_DEPRECATED: Program_DEPRECATED[] = [
  {
    id: 'meditation-mental-health',
    title: 'Mindful Living & Meditation',
    description: 'Cultivate inner peace and emotional resilience through guided meditation and mental wellness workshops.',
    longDescription: 'This program offers guided meditation sessions, mindfulness practices, and workshops focused on stress reduction, emotional balance, and enhancing overall mental well-being. Learn techniques rooted in ancient wisdom and supported by modern science to navigate life\'s challenges with greater clarity and calm.',
    iconName: 'OmSymbol',
    image: 'https://raw.githubusercontent.com/amishsharmadevapp/vivekafound/main/Assistant_A_Mindful_Living_&_Med.png?raw=true',
    category: 'Meditation + Mental Health',
    dataAiHint: 'meditation yoga'
  },
  {
    id: 'women-empowerment',
    title: 'Nari Shakti: Women\'s Empowerment',
    description: 'Empowering women through skill development, entrepreneurship, and leadership training.',
    longDescription: 'Nari Shakti focuses on creating opportunities for women by providing vocational training, financial literacy, entrepreneurship support, and leadership development. We aim to foster self-reliance and enable women to become key contributors to their families and communities.',
    iconName: 'Users',
    image: 'https://raw.githubusercontent.com/amishsharmadevapp/vivekafound/main/Assistant_A_Nari_Shakti_Women_s.png?raw=true',
    category: 'Social & Economic Empowerment',
    dataAiHint: 'women community'
  },
  // ... other static programs can remain here for reference during migration ...
];


// MythologyResource type and data are also DEPRECATED here as /mythology-meditation page
// now fetches from the 'resources' collection in Firestore.
export type ResourceType_DEPRECATED = 'article' | 'podcast' | 'video';

export interface MythologyResource_DEPRECATED {
  id: string;
  title: string;
  type: ResourceType_DEPRECATED;
  description: string;
  linkOrContent: string;
  image: string;
  iconName?: IconName_DEPRECATED | string;
  icon?: ReactNode;
  dataAiHint?: string;
  contentLink?: string;
  content?: string;
  tags?: string[];
  language?: string;
}

export const mythologyResources_DEPRECATED: MythologyResource_DEPRECATED[] = [
  {
    id: 'ramayana-lessons',
    title: 'Life Lessons from the Ramayana',
    type: 'article',
    description: 'An insightful article exploring the ethical and moral teachings of the epic Ramayana.',
    linkOrContent: `The Ramayana, one of India's most revered epics, offers profound insights into dharma, karma, and the human condition. This article explores key characters and events, extracting timeless lessons applicable to modern life, such as the importance of duty, righteousness, and perseverance in the face of adversity.`,
    image: 'https://raw.githubusercontent.com/amishsharmadevapp/vivekafound/main/Assistant_A_Life_Lessons_from_th.png',
    iconName: 'FileText',
    dataAiHint: 'epic scroll'
  },
  // ... other static resources can remain here for reference ...
];
