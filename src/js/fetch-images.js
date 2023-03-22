const API_KEY = '34628461-4bda2ae404146a46c3fd3a186';

export function fetchImages(searchItem, pageNumber) {
  return fetch(
    `https://pixabay.com/api/?key=${API_KEY}&q=${searchItem}&image_type=photo&orientation=horizontal&safesearch=true&page=${pageNumber}&per_page=6`
  ).then(r => {
    if (!r.ok) {
      throw new Error(r.status);
    }
    return r.json();
  });
}
