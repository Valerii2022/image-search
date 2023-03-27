const axios = require('axios').default;
import imageCardTemplate from './templates/gallery.hbs';
import Notiflix from 'notiflix';
import { fetchImages } from './js/fetch-images';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('.form-input'),
  submitBtn: document.querySelector('.search-btn'),
  gallery: document.querySelector('.gallery'),
  loadBtn: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', handleSubmitForm);
refs.loadBtn.addEventListener('click', handleLoadMoreBtn);

let pageNumber = 1;
let uploadedHits = 0;
let modalLightbox;

function handleSubmitForm(event) {
  refs.gallery.innerHTML = '';
  uploadedHits = 0;
  pageNumber = 1;
  event.preventDefault();
  const searchItem = refs.input.value;

  fetchImages(searchItem, pageNumber).then(onFetchSuccess).catch(onFetchError);
}

function handleLoadMoreBtn() {
  modalLightbox.destroy();

  const searchItem = refs.input.value;
  fetchImages(searchItem, pageNumber).then(onFetchSuccess).catch(onFetchError);
}

function onFetchSuccess(data) {
  if (data.total === 0 || refs.input.value === '') {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  if (pageNumber === 1 && data.totalHits > 0) {
    Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
  }
  pageNumber += 1;

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
  console.log(error);
}

function renderGalleryCards(data) {
  data.hits.map(el => {
    refs.gallery.insertAdjacentHTML('beforeend', imageCardTemplate(el));

    const { height: cardHeight } =
      refs.gallery.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    refs.loadBtn.classList.remove('is-hidden');
    uploadedHits += 1;
  });
}
