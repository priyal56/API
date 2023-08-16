const axios = require('axios');
const fs = require('fs');

const baseURL = 'https://catfact.ninja';
const breedsEndpoint = '/breeds';

// Function to write response to a text file
async function writeResponseToFile(response) {
  try {
    await fs.promises.writeFile('response.txt', JSON.stringify(response.data, null, 2));
    console.log('Response has been written to response.txt');
  } catch (error) {
    console.error('Error writing to file:', error);
  }
}

// Function to fetch data from a given page
async function fetchData(page) {
  try {
    const response = await axios.get(`${baseURL}${breedsEndpoint}`, {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

// Function to get the number of available pages
async function getNumberOfPages() {
  try {
    const response = await axios.get(`${baseURL}${breedsEndpoint}`);
    return response.data.last_page;
  } catch (error) {
    console.error('Error getting number of pages:', error);
    return 0;
  }
}

// Function to group cat breeds by country
function groupBreedsByCountry(data) {
  const groupedBreeds = {};
  data.forEach(breed => {
    const country = breed.origin;
    if (!groupedBreeds[country]) {
      groupedBreeds[country] = [];
    }
    groupedBreeds[country].push(breed);
  });
  return groupedBreeds;
}

(async () => {
  // Step 1: Fetch data and log response to a text file
  const response = await fetchData(1);
  if (response) {
    await writeResponseToFile(response);
  }

  // Step 2: Get number of pages
  const totalPages = await getNumberOfPages();
  console.log('Number of pages:', totalPages);

  // Step 3 and 4: Get data from all pages and group by country
  const allBreeds = [];
  for (let page = 1; page <= totalPages; page++) {
    const pageData = await fetchData(page);
    if (pageData) {
      allBreeds.push(...pageData.data);
    }
  }

  const groupedBreeds = groupBreedsByCountry(allBreeds);
  console.log('Breeds grouped by Country:', groupedBreeds);
})();
