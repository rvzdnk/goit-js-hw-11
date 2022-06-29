// Axios Library
const axios = require('axios');

// Notifix Library
import Notiflix from 'notiflix';

//Simple Lightbox library
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

//Import function which send a request to server
import { fetchPhotos } from './js/fetchPhotos';

//Import styles
import './sass/index.scss';

//QS & let
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('input');
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");

let lightbox;
let pageNumber;
let leftHits;


function searchPhotos() {
  fetchPhotos(searchInput.value, pageNumber)
    .then(data => {
      renderPhotos(data);
    })
    .catch(error => {
      console.log(error);
    });
}


function renderPhotos({ totalHits, hits }) {
  
  const markup = hits
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="gallery__item">
                  <a class="gallery__link" href="${largeImageURL}">
                    <img class="gallery__img"  src="${webformatURL}" alt="${tags}" loading="lazy" />
                  </a>
                  <div class="gallery__info">
                    <p class="info__item">
                      <b>Likes</b>${likes}
                    </p>
                    <p class="info__item">
                      <b>Views</b>${views}
                    </p>
                    <p class="info__item">
                      <b>Comments</b>${comments}
                    </p>
                    <p class="info__item">
                      <b>Downloads</b>${downloads}
                    </p>
                  </div>
                </div>`;
      }
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
  
  leftHits = totalHits - pageNumber * 40;

  if (totalHits == 0) {
    Notiflix.Notify.failure(
      `Sorry, there are no images matching your search query. Please try again.`
    );
  }

  if (!totalHits == 0 && leftHits < 0) {
    Notiflix.Notify.failure(
      `We're sorry, but you've reached the end of search results.`
  );
  }

  if (pageNumber == 1 && totalHits > 0) {
    Notiflix.Notify.success(
      `Hooray! We found ${totalHits} images`
      );
  }

  
  if (typeof lightbox === 'object') {
    lightbox.destroy();
  }

  lightbox = new SimpleLightbox('.gallery a', {
    captionDelay: '250',
  });

  if (pageNumber > 1) {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}

const newSearch = e => {
  e.preventDefault();
  pageNumber = 1;
  gallery.innerHTML = '';
  console.log(`start: ${pageNumber}`);
  searchPhotos();
}

searchForm.addEventListener('submit', newSearch);


function loadMore() {
  pageNumber += 1;
  searchPhotos();
}

function infiniteScrolling (){
  
  if (window.scrollY + window.innerHeight >= 
    document.documentElement.scrollHeight) {
    loadMore();
  }
}

window.addEventListener("scroll", infiniteScrolling);

