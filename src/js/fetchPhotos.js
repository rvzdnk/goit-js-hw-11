// Import Axios library
import axios from "axios";
const axios = require('axios');

// Function which send a request to the pixabay
export async function fetchPhotos(searchedValue, page) {
  const params = new URLSearchParams({
    key: "28306933-4038f820c251ef9eb8ffc5349",
    q: searchedValue,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
    per_page: 40,
    page,
  });

  try {
    const response = await axios({
      method: 'get',
      url: `https://pixabay.com/api/?${params}`,
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};