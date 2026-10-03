import { Clapperboard, FlaskConical, Ghost, Gift, Globe, Landmark, MessageCircleHeart, PawPrint, Skull, Tag, Trophy, UtensilsCrossed, Volleyball, type LucideIcon } from 'lucide-react';
import styles from '../App.module.css';

// W16-03: one badge per builtin category (icon on its own gradient). Pack
// categories without art get a neutral tag. Decorative: the category name is
// always next to it.
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  history: Landmark,
  geography: Globe,
  science: FlaskConical,
  animals: PawPrint,
  'pop-culture': Clapperboard,
  sports: Volleyball,
  'weird-facts': Ghost,
  // W17-04 category, W17-01 table rounds and W17-06 seasonal packs.
  food: UtensilsCrossed,
  'about-us': MessageCircleHeart,
  christmas: Gift,
  halloween: Skull,
  'sports-events': Trophy
};

export function hasCategoryArt(categoryId: string) {
  return Object.hasOwn(CATEGORY_ICONS, categoryId);
}

export function CategoryArt({ categoryId, size = 'md' }: { categoryId: string; size?: 'sm' | 'md' }) {
  const Icon = hasCategoryArt(categoryId) ? CATEGORY_ICONS[categoryId] : Tag;
  return (
    <span
      className={styles.categoryArt}
      data-category={hasCategoryArt(categoryId) ? categoryId : 'other'}
      data-size={size}
      aria-hidden="true"
    >
      <Icon size={size === 'sm' ? 14 : 20} strokeWidth={2.4} />
    </span>
  );
}
