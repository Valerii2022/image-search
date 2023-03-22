// const axios = require('axios/dist/node/axios.cjs');
import Notiflix from 'notiflix';

// Notiflix.Notify.success('Sol lucet omnibus');

// Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");

// Notiflix.Notify.warning('Memento te hominem esse');

// Notiflix.Notify.info('Cogito ergo sum');

const refs = {
    form: document.querySelector('.search-form'),
    input: document.querySelector('.search-form_input'),
    submitBtn: document.querySelector('.search-form_btn'),
    gallery: document.querySelector('.gallery'),
    loadBtn: document.querySelector('.load-more')
}

refs.submitBtn.addEventListener('click', handleSubmitBtn);

let pageNumber = 1;

function handleSubmitBtn(event) {
    event.preventDefault();
    const searchItem = refs.input.value;

    fetch(`https://pixabay.com/api/?key=34628461-4bda2ae404146a46c3fd3a186&q=${searchItem}&image_type=photo&orientation=horizontal&safesearch=true&page=${pageNumber}&per_page=40`).then(r => {
        if (!r.ok) {
            throw new Error(r.status);
        }
        return r.json();
    }).then(onFetchSuccess).catch(onFetchError);

    pageNumber += 1;
}

function onFetchSuccess(r) { 
    refs.gallery.innerHTML = '';

    if (r.total == 0) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    }

    r.hits.map(el => {
        const markup =
            `<div class="photo-card">
               <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" />
               <div class="info">
                  <p class="info-item"><b>Likes</b>${el.likes}</p>
                  <p class="info-item"><b>Views</b>${el.views}</p>
                  <p class="info-item"><b>Comments</b>${el.comments}</p>
                  <p class="info-item"><b>Downloads</b>${el.downloads}</p>
               </div>
            </div>`;
        
        refs.gallery.insertAdjacentHTML('beforeend', markup);
    })

}

function onFetchError(error) {
    console.log(error)
}