import axios from 'axios';

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
    return await axios.get(`${this.#BASE_API}`, {
      params: {
        q: this.query,
        page: this.page,
        ...this.baseSearchParams,
      },
    });
  }
}
