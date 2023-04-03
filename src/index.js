import imageCardTemplate from './templates/gallery.hbs';
import Notiflix from 'notiflix';
import { PixabayAPI } from './js/pixabay-API';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const pixabayApi = new PixabayAPI();

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('.form-input'),
  submitBtn: document.querySelector('.search-btn'),
  gallery: document.querySelector('.gallery'),
  loadBtn: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', handleSubmitForm);
refs.loadBtn.addEventListener('click', handleLoadMoreBtn);

let uploadedHits = 0;
let modalLightbox;

async function handleSubmitForm(event) {
  event.preventDefault();
  refs.gallery.innerHTML = '';
  if (refs.input.value === '') {
    Notiflix.Notify.failure(
      'Sorry, your search query is empty. Please try again.'
    );
    return;
  }
  uploadedHits = 0;
  pixabayApi.page = 1;
  pixabayApi.query = refs.input.value;

  try {
    const { data } = await pixabayApi.fetchPhotos();
    onFetchSuccess(data);
  } catch (error) {
    onFetchError;
  }

  refs.input.value = '';
}

async function handleLoadMoreBtn() {
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
    refs.loadBtn.classList.add('is-hidden');
    return;
  }

  if (pixabayApi.page === 1 && data.totalHits > 0) {
    Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
  }
  pixabayApi.page += 1;

  renderGalleryCards(data);

  modalLightbox = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
  });
  modalLightbox.refresh();

  if (data.totalHits === uploadedHits && data.totalHits > 0) {
    refs.loadBtn.classList.add('is-hidden');
    Notiflix.Notify.info(
      `We're sorry, but you've reached the end of search results.`
    );
  }
}

function onFetchError(error) {
  console.warn(error);
}

function renderGalleryCards(data) {
  refs.gallery.insertAdjacentHTML('beforeend', imageCardTemplate(data.hits));

  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });

  uploadedHits += data.hits.length;
  refs.loadBtn.classList.remove('is-hidden');
}
