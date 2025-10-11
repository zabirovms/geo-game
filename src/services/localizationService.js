export const supportedGameLocales = Object.freeze([
  {code: 'tg', name: 'тоҷикӣ'}
]);

export const supportedGameLocalesByCode = Object.freeze(
  supportedGameLocales.reduce((res, locale) => ({...res, [locale.code]: locale.name}), {})
);

export const isLocaleSupported = locale => supportedGameLocalesByCode[locale] !== undefined;

export const getTranslation = locale =>
  import(`../locales/ui/${locale}.json`)
    .then(translations => ({
      ...translations
    }));

export const getBestMatchingLocale = () => {
  const defaultLocale = 'tg';
  return defaultLocale;
};

export const fetchData = (locale, continent) => {
  if (!isLocaleSupported(locale)) {
    return Promise.reject('Locale not supported');
  }

  return import(`../locales/data/${locale}/${continent}`);
};

