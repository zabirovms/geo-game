import tgTranslations from '../locales/ui/tg.json';
import tgAfrica from '../locales/data/tg/africa.json';
import tgAsia from '../locales/data/tg/asia.json';
import tgEurope from '../locales/data/tg/europe.json';
import tgNorthAmerica from '../locales/data/tg/north-america.json';
import tgOceania from '../locales/data/tg/oceania.json';
import tgSouthAmerica from '../locales/data/tg/south-america.json';

const continentData = {
  africa: tgAfrica,
  asia: tgAsia,
  europe: tgEurope,
  'north-america': tgNorthAmerica,
  oceania: tgOceania,
  'south-america': tgSouthAmerica
};

export const supportedGameLocales = Object.freeze([
  {code: 'tg', name: 'тоҷикӣ'}
]);

export const supportedGameLocalesByCode = Object.freeze(
  supportedGameLocales.reduce((res, locale) => ({...res, [locale.code]: locale.name}), {})
);

export const isLocaleSupported = locale => supportedGameLocalesByCode[locale] !== undefined;

export const getTranslation = locale => {
  console.log('getTranslation called with locale:', locale);
  console.log('tgTranslations:', tgTranslations);
  if (locale === 'tg') {
    return Promise.resolve(tgTranslations);
  }
  return Promise.reject('Locale not supported');
};

export const getBestMatchingLocale = () => {
  const defaultLocale = 'tg';
  return defaultLocale;
};

export const fetchData = (locale, continent) => {
  console.log('fetchData called with:', {locale, continent});
  if (!isLocaleSupported(locale)) {
    return Promise.reject('Locale not supported');
  }

  if (locale === 'tg' && continentData[continent]) {
    console.log('Returning continent data for:', continent);
    return Promise.resolve(continentData[continent]);
  }

  return Promise.reject(`Data not found for locale: ${locale}, continent: ${continent}`);
};

