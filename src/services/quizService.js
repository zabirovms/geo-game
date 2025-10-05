/* globals fetch */

export const fetchData = (locale, id) => {
  return fetch(`locales/data/${locale}/${id}.json`)
    .then(r => r.json())
    .catch(function (ex) {
      console.error('parsing failed', ex);
    });
};