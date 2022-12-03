const GtfsRealtimeBindings = require('gtfs-realtime-bindings');
const request = require('request');
const express = require('express');
const app = express();

//busRequest
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

fetchInfo().then(data => {
  app.get('/fetch', function (req, res) {
    res.json(data)
  })
}).catch(err => console.log(err))