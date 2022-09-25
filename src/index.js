import { Report } from 'notiflix/build/notiflix-report-aio';
import { ApiService } from './api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
Report.init({ width: 'auto', titleMaxLength: 60 });

const refs = {
  formEl: document.querySelector('.search-form'),
  inputEl: document.querySelector('.search-input'),
  btnEl: document.querySelector('.search-btn'),
  galleryEl: document.querySelector('.gallery'),
  loadBtnEl: document.querySelector('.load-more'),
};

let totalPages = 1;
const apiService = new ApiService();
let gallerySimpleLightbox = {};

refs.formEl.addEventListener('submit', onSubmit);
refs.loadBtnEl.addEventListener('click', onLoadMore);

function onSubmit(evt) {
  evt.preventDefault();
  loadMoreHidden();
  clearDisplay();
  const searchText = evt.currentTarget.elements.searchQuery.value.trim();
  apiService.text = searchText;
  apiService.resetPage();

  if (!searchText) {
    Report.info('Enter a request, please', '');
    return;
  }
  apiService
    .getImages()
    .then(onFoundSuccess)
    .catch(error => {
      clearDisplay();
      Report.failure('Something is wrong. Please try again.', '');
    });
}

function onFoundSuccess(images) {
  const { totalHits, hits } = images;
  if (hits.length === 0) {
    Report.info(
      'Sorry, there are no images matching your search query. Please try again.',
      '',
      'I understand'
    );
    return;
  }
  totalPages = Math.ceil(totalHits / 40);
  Report.info(`Hooray! We found ${totalHits} images.`, '', "Let's watch");
  loadMoreVisibility();
  insertImages(hits);
  gallerySimpleLightbox = new SimpleLightbox('.photo-link');
}

function insertImages(images) {
  const markup = renderImages(images);
  refs.galleryEl.insertAdjacentHTML('beforeend', markup);
  // updateSimpleLightbox();

  if (totalPages === apiService.page) {
    Report.info(
      "We're sorry, but you've reached the end of search results.",
      '',
      'Well, okay'
    );
    loadMoreHidden();
  }
}

function renderImages(images) {
  return images
    .map(
      image =>
        `<div class="photo-card">
    <a class="photo-link" href="${image.largeImageURL}"><img
    class="photo-image"
      src="${image.webformatURL}"
      alt="${image.tags}"
      loading="lazy"
      height=""
      width=""
    /></a>
    <div class="info">
      <p class="info-item">
        <b>Likes <br />${image.likes}</b>
      </p>
      <p class="info-item">
        <b>Views <br />${image.views}</b>
      </p>
      <p class="info-item">
        <b>Comments<br />${image.comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads<br />${image.downloads}</b>
      </p>
    </div>
  </div>`
    )
    .join('');
}

function clearDisplay() {
  refs.galleryEl.innerHTML = '';
}

function onLoadMore() {
  apiService.getImages().then(data => insertImages(data.hits));
  // gallerySimpleLightbox.refresh();
  // updateSimpleLightbox();
}

function loadMoreHidden() {
  refs.loadBtnEl.classList.add('is-hidden');
}

function loadMoreVisibility() {
  refs.loadBtnEl.classList.remove('is-hidden');
}

// function updateSimpleLightbox() {
//   gallerySimpleLightbox.destroy();
//   gallerySimpleLightbox = new SimpleLightbox('.photo-link');
// }
