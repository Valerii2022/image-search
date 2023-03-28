export class PixabayAPI {
  #API_KEY = '34628461-4bda2ae404146a46c3fd3a186';
  #BASE_API = 'https://pixabay.com/api/';

  page = 1;
  count = 40;
  query = null;

  baseSearchParams = {
    key: this.#API_KEY,
    per_page: this.count,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  };

  async fetchPhotos() {
    const searchParams = new URLSearchParams({
      q: this.query,
      page: this.page,
      ...this.baseSearchParams,
    });

    const response = await fetch(`${this.#BASE_API}?${searchParams}`);
    return await response.json();

    //  return fetch(`${this.#BASE_API}?${searchParams}`).then(response => {
    //!    if (!response.ok) {
    //!      throw new Error(response.status);
    //!    }
    //    return response.json();
    //  });
  }
}
