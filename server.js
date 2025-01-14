const GtfsRealtimeBindings = require('gtfs-realtime-bindings');
const request = require('request');
const express = require('express');
const app = express();
const path = require('path');

let busSettings = {
  method: 'GET',
  url: 'https://gtfs-rt.itsmarta.com/TMGTFSRealTimeWebService/vehicle/vehiclepositions.pb',
  encoding: null
};
function busRequest() {
  return new Promise(function (resolve, reject) {
    request(busSettings, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
        resolve(feed);
      } else {
        reject(error);
      }
    });
  });
}

async function fetchInfo() {
  let busInfo = await busRequest();
  let response = await fetch('https://developerservices.itsmarta.com:18096/railrealtimearrivals?apiKey=58fbf0e5-6f7b-4d84-80f0-57208ba0b88b');
  let railInfo = await response.json();
  return {bus: busInfo, rail: railInfo};
}

// Function to update the data every second
function updateDataPeriodically() {
  setInterval(async () => {
    try {
      let data = await fetchInfo();
      latestData = data;  // Store the latest data
      console.log('Data updated at', new Date());
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }, 1000); // Fetch new data every 1000ms (1 second)
}

// Start updating data in the background
updateDataPeriodically();

// Serve the latest data on the /fetch route
app.use(express.static(path.join(__dirname)));

// API route to serve the latest data
app.get('/fetch', (req, res) => {
  res.json(latestData);  // Send the latest fetched data
});

// Serve the index.html on the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server and listen on port 3000
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});