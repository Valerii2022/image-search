import imageCardTemplate from '../templates/gallery.hbs';
import { PixabayAPI } from './pixabay-API';

import Notiflix from 'notiflix';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const pixabayApi = new PixabayAPI();

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('.form-input'),
  submitBtn: document.querySelector('.search-btn'),
  gallery: document.querySelector('.gallery'),
  sentinel: document.querySelector('.sentinel'),
};

refs.form.addEventListener('submit', handleSubmitForm);

let uploadedHits = 0;
let modalLightbox;
let totalCards = 0;

async function handleSubmitForm(event) {
  event.preventDefault();
  refs.gallery.innerHTML = '';
  if (refs.input.value.trim() === '') {
    Notiflix.Notify.failure(
      'Sorry, your search query is empty. Please try again.'
    );
    refs.input.value = '';
    return;
  }
  uploadedHits = 0;
  pixabayApi.page = 1;
  pixabayApi.query = refs.input.value.trim();

  try {
    const { data } = await pixabayApi.fetchPhotos();
    onFetchSuccess(data);
  } catch (error) {
    onFetchError;
  }
  refs.input.value = '';
}

async function loadMoreCards() {
  modalLightbox.destroy();

  try {
    const { data } = await pixabayApi.fetchPhotos();
    onFetchSuccess(data);
  } catch (error) {
    onFetchError;
  }
}

function onFetchSuccess(data) {
  if (data.total === 0 || pixabayApi.query === '') {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  if (pixabayApi.page === 1 && data.totalHits > 0) {
    Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
    totalCards = data.totalHits;
  }
  pixabayApi.page += 1;

  renderGalleryCards(data);

  modalLightbox = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
  });
  modalLightbox.refresh();

  if (uploadedHits >= 500) {
    Notiflix.Notify.info(
      `We're sorry, but you've reached the end of search results.`
    );
    return;
  }
}

function onFetchError(error) {
  console.warn(error);
}

function renderGalleryCards(data) {
  refs.gallery.insertAdjacentHTML('beforeend', imageCardTemplate(data.hits));

  uploadedHits += data.hits.length;
}

const intersectionObserve = entries => {
  entries.forEach(entry => {
    if (
      entry.isIntersecting &&
      pixabayApi.query !== '' &&
      uploadedHits < totalCards
    ) {
      loadMoreCards();
    }
  });
};

const observer = new IntersectionObserver(intersectionObserve, {
  rootMargin: '200px',
});

observer.observe(refs.sentinel);
