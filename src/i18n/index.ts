// Central export for all static translations — 100% coverage for all 20 languages
export { fr } from './fr';
export { de } from './de';
export { it } from './it';
export { pt } from './pt';
export { zh } from './zh';
export { ja } from './ja';
export { ko } from './ko';
export { ar } from './ar';
export { hi } from './hi';
export { bn } from './bn';
export { ru } from './ru';
export { pl } from './pl';
export { tr } from './tr';
export { vi } from './vi';
export { th } from './th';
export { id } from './id';
export { tl } from './tl';
export { sw } from './sw';
export { ur } from './ur';

import { fr } from './fr';
import { de } from './de';
import { it } from './it';
import { pt } from './pt';
import { zh } from './zh';
import { ja } from './ja';
import { ko } from './ko';
import { ar } from './ar';
import { hi } from './hi';
import { bn } from './bn';
import { ru } from './ru';
import { pl } from './pl';
import { tr } from './tr';
import { vi } from './vi';
import { th } from './th';
import { id } from './id';
import { tl } from './tl';
import { sw } from './sw';
import { ur } from './ur';

/** All static translations keyed by language code */
export const ALL_TRANSLATIONS: Record<string, Record<string, string>> = {
  fr, de, it, pt, zh, ja, ko, ar, hi, bn, ru, pl, tr, vi, th, id, tl, sw, ur,
};
