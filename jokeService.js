const https = require('https');

const apiUrl = "https://v2.jokeapi.dev/joke/Programming?safe-mode";

// Fetch a random programming joke
async function fetchJoke() {
  return new Promise((resolve, reject) => {
    https.get(apiUrl, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          const joke = JSON.parse(data);
          if (joke.type === 'twopart') {
            resolve(`Coder1: ${joke.setup}\nCoder2: ${joke.delivery}`);
          } else if (joke.type === 'single') {
            resolve(joke.joke);
          } else {
            resolve('Could not find a suitable joke.');
          }
        } catch (err) {
          reject(err);
        }
      });

      response.on('error', (err) => {
        reject(err);
      });
    });
  });
}

module.exports = { fetchJoke };
