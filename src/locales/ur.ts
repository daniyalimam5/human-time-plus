import type { LocaleDefinition } from './types';

const monthsUrdu = [
  'جنوری',
  'فروری',
  'مارچ',
  'اپریل',
  'مئی',
  'جون',
  'جولائی',
  'اگست',
  'ستمبر',
  'اکتوبر',
  'نومبر',
  'دسمبر',
];

const weekdaysUrdu = ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];

export const ur: LocaleDefinition = {
  code: 'ur',
  justNow: 'ابھی ابھی',
  past: (phrase) => `${phrase} پہلے`,
  future: (phrase) => `${phrase} میں`,
  units: {
    second: { one: 'سیکنڈ', other: 'سیکنڈ' },
    minute: { one: 'منٹ', other: 'منٹ' },
    hour: { one: 'گھنٹہ', other: 'گھنٹے' },
    day: { one: 'دن', other: 'دن' },
    week: { one: 'ہفتہ', other: 'ہفتے' },
    month: { one: 'مہینہ', other: 'مہینے' },
    year: { one: 'سال', other: 'سال' },
  },
  durationUnits: {
    day: { one: 'دن', other: 'دن' },
    hour: { one: 'گھنٹہ', other: 'گھنٹے' },
    minute: { one: 'منٹ', other: 'منٹ' },
    second: { one: 'سیکنڈ', other: 'سیکنڈ' },
  },
  // Compact duration symbols stay in Latin letters (1h 2m 5s) since Urdu has
  // no standardized short-form equivalents and the compact style is meant
  // to be a terse, at-a-glance symbol regardless of locale.
  durationCompactUnits: {
    day: 'd',
    hour: 'h',
    minute: 'm',
    second: 's',
  },
  durationJoiner: '، ',
  // Urdu has no standard abbreviated month/weekday forms, so short and
  // long share the same full names.
  monthsShort: monthsUrdu,
  monthsLong: monthsUrdu,
  weekdaysShort: weekdaysUrdu,
  weekdaysLong: weekdaysUrdu,
};
