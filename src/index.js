import { Report } from 'notiflix/build/notiflix-report-aio';
import axios from 'axios';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';
import { ApiService } from './api';

const refs = {
  formEl: document.querySelector('.search-form'),
  inputEl: document.querySelector('.search-input'),
  btnEl: document.querySelector('.search-btn'),
  galleryEl: document.querySelector('.gallery'),
  loadBtnEl: document.querySelector('.load-more'),
};

const apiService = new ApiService();

refs.formEl.addEventListener('submit', onSubmit);
refs.loadBtnEl.addEventListener('click', onLoadMore);

function onSubmit(evt) {
  evt.preventDefault();
  clearDisplay();
  const searchText = evt.currentTarget.elements.searchQuery.value.trim();
  console.log(searchText);

  apiService.text = searchText;
  apiService.resetPage();

  if (!searchText) {
    Report.info('Enter a request, please', '');
    // clearDisplay();
    return;
  }
  apiService.getImages().then(onFoundSuccess);
  // .catch(error => {
  // clearDisplay();
  // Report
  // .failure
  // 'Sorry, there are no images matching your search query. Please try again.',
  // ''
  // ();
  // }
  // );
}

function onFoundSuccess(images) {
  // console.log(images);
  const { totalHits, hits } = images;
  if (hits.length === 0) {
    // clearDisplay();
    Report.info(
      'Sorry, there are no images matching your search query. Please try again.',
      '',
      'I understand'
    );
    return;
  }
  console.log(hits);
  // Report.info(`Hooray! We found ${totalHits} images.`, '', "Let's watch");
  insertImages(hits);
}

function insertImages(images) {
  const markup = renderImages(images);
  refs.galleryEl.insertAdjacentHTML('beforeend', markup);
}

function renderImages(images) {
  return images
    .map(
      image =>
        `<div class="photo-card">
    <img
    class="photo-image"
      src="${image.webformatURL}"
      alt="${image.tags}"
      loading="lazy"
      height=""
      width=""
    />
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
}
