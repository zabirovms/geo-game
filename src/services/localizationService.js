import en from '../locales/ui/en';

export const supportedGameLocales = Object.freeze([
  {code: 'en', name: 'English'},
  {code: 'ru', name: 'русский'},
  {code: 'tg', name: 'тоҷикӣ'}
]);

export const supportedGameLocalesByCode = Object.freeze(
  supportedGameLocales.reduce((res, locale) => ({...res, [locale.code]: locale.name}), {})
);

export const isLocaleSupported = locale => supportedGameLocalesByCode[locale] !== undefined;

export const getTranslation = locale =>
  import(`../locales/ui/${locale}`)
    .then(translations => ({
      ...en, // need default keys to english as not all dictionaries are complete
      ...translations
    }));

export const getBestMatchingLocale = () => {
  const defaultLocale = 'tg';

  if (!window.navigator) {
    return defaultLocale;
  }

  const browserLocales = navigator.languages !== undefined ? navigator.languages : [navigator.language];

  for (let i = 0, l = browserLocales.length; i < l; i++) {
    const baseLocale = browserLocales[i].toLocaleLowerCase().split('-')[0];

    if (supportedGameLocalesByCode[baseLocale]) {
      return baseLocale;
    }
  }

  return defaultLocale;
};

export const fetchData = (locale, continent) => {
  if (!isLocaleSupported(locale)) {
    return Promise.reject('Locale not supported');
  }

  return import(`../locales/data/${locale}/${continent}`);
};

