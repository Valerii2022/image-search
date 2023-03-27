const API_KEY = '34628461-4bda2ae404146a46c3fd3a186';
const BASE_API = 'https://pixabay.com/api/';

export function fetchImages(searchItem, pageNumber) {
  return fetch(
    `${BASE_API}?key=${API_KEY}&q=${searchItem}&image_type=photo&orientation=horizontal&safesearch=true&page=${pageNumber}&per_page=40`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
