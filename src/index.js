// const axios = require('axios/dist/node/axios.cjs');
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

refs.submitBtn.addEventListener('click', handleSubmitBtn);
refs.loadBtn.addEventListener('click', handleLoadMoreBtn);

let pageNumber = 1;
let uploadedHits = 0;
let modalLightbox;

function handleSubmitBtn(event) {
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

function onFetchSuccess(response) {
  if (pageNumber === 1 && response.totalHits > 0) {
    Notiflix.Notify.info(`Hooray! We found ${response.totalHits} images.`);
  }
  pageNumber += 1;
  if (response.total === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  renderGalleryCards(response);

  modalLightbox = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
  });
  modalLightbox.refresh();

  if (response.totalHits === uploadedHits && response.totalHits > 0) {
    refs.loadBtn.classList.add('is-hidden');
    Notiflix.Notify.info(
      `We're sorry, but you've reached the end of search results.`
    );
  }
}

function onFetchError(error) {
  console.log(error);
}

function renderGalleryCards(response) {
  response.hits.map(el => {
    // const markup = `
    //      <a href="${el.largeImageURL}">
    //         <div class="photo-card">
    //            <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" />
    //            <div class="info">
    //               <p class="info-item"><b>Likes</b>${el.likes}</p>
    //               <p class="info-item"><b>Views</b>${el.views}</p>
    //               <p class="info-item"><b>Comments</b>${el.comments}</p>
    //               <p class="info-item"><b>Downloads</b>${el.downloads}</p>
    //            </div>
    //         </div>
    //      </a>`;

    // refs.gallery.insertAdjacentHTML('beforeend', markup);
    refs.gallery.insertAdjacentHTML('beforeend', imageCardTemplate(el));

    // ==================================
    const { height: cardHeight } =
      refs.gallery.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
    // ==================================

    refs.loadBtn.classList.remove('is-hidden');
    uploadedHits += 1;
  });
}
