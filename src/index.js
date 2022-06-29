//Import library to show notifications
import Notiflix from 'notiflix';

//Import styles
import './sass/index.scss';

// Import of simpleLightbox library
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css'

//Import modules
import './js/fetchPhotos.js';
import { fetchPhotos } from './js/fetchPhotos';


//QS
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-form__input");
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');


let pageNumber;
let totalHits;
let lightbox;
let leftHits;

//Event listeners
searchForm.addEventListener("submit", newSearch);

loadMoreBtn.addEventListener("click", loadMoreImg);

// Function to search photo
function searchImages() {
    fetchPhotos(searchInput.value, pageNumber)
      .then(photos => {
        renderPhotos(photos);
      })
      .catch(error => console.log(error));
  }

function newSearch (e){
    e.preventDefault();
    loadMoreBtn.style.display = "none"
    pageNumber = 1;
    searchImages();
    gallery.innerHTML = ""; 
}



function renderPhotos(hits, totalHits) {
    leftHits = totalHits - pageNumber * 40;

    if (totalHits == 0) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      } else if (!totalHits == 0 && leftHits <0) {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      } else if (totalHits > 0 && pageNumber == 1) {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      }

    const markup = hits
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) =>
          `
          <div class="gallery__item">
          <a class="gallery__link" href="${largeImageURL}"><img class="gallery__img" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
          <div class="gallery__info">
            <p class="info__item">
              <b class="info__label">Likes</b>
              <span class="info__data">${likes}</span>
            </p>
            <p class="info__item">
              <b class="info__label">Views</b>
              <span class="info__data">${views}</span>
            </p>
            <p class="info__item">
              <b class="info__label">Comments</b>
              <span class="info__data">${comments}</span>
            </p>
            <p class="info__item">
              <b class="info__label">Downloads</b>
              <span class="info__data">${downloads}</span>
            </p>
          </div>
        </div>
        `)
        .join("");
        
        gallery.insertAdjacentHTML("beforeend", markup);
      
        if (typeof lightbox === "object") {
          lightbox.destroy();
          }

        lightbox = new SimpleLightbox(".gallery__item a");

        if (pageNumber > 1) {
            const { height: cardHeight } = document
            .querySelector('.gallery .gallery__item').getBoundingClientRect();
          
            window.scrollBy({
              top: cardHeight * 2,
              behavior: 'smooth',
            });
          }        
  }
  
function loadMoreImg (){
    pageNumber +=1;
    searchImages();
}



// Function to check end of rendering photos

  

