import imageCardTemplate from '../templates/gallery.hbs';
import Notiflix from 'notiflix';
import { PixabayAPI } from './pixabay-API';
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
// let modalLightbox;

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
  //   modalLightbox.destroy();

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
  }
  pixabayApi.page += 1;

  renderGalleryCards(data);

  //   modalLightbox = new SimpleLightbox('.gallery a', {
  //     captionDelay: 250,
  //   });
  //   modalLightbox.refresh();
}

function onFetchError(error) {
  console.warn(error);
}

function renderGalleryCards(data) {
  refs.gallery.insertAdjacentHTML('beforeend', imageCardTemplate(data.hits));

  uploadedHits += data.hits.length;
  refs.loadBtn.classList.remove('is-hidden');
}

const intersectionObserve = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && pixabayApi.query !== '') {
      console.log(entry);
      console.log(uploadedHits);
      loadMoreCards();
      pixabayApi.page += 1;
    }
  });
};

const observer = new IntersectionObserver(intersectionObserve, {
  rootMargin: '150px',
});

observer.observe(refs.sentinel);
