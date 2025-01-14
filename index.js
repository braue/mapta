let map;
let markersOnMap = [];

async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");

    map = new Map(document.getElementById("map"), {
        center: new google.maps.LatLng(33.7488, -84.3877),
        zoom: 14,
        mapId: "338bf3676ad5446b"
    });

    fetchVehicleData();
    setInterval(fetchVehicleData, 1000); // Fetch every 5 seconds (5000 ms)
}

async function fetchVehicleData() {
    try {
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
        const response = await fetch('/fetch');
        const data = await response.json();
        
        const buses = data.bus.entity
        const rail = data.rail.RailArrivals


        // Remove old markers that are no longer in the data
        for (let i = 0; i < markersOnMap.length; i++) {
            markersOnMap[i].position = null; // Remove marker from the map
        }
        
        // Add new markers based on updated vehicle data
        buses.forEach(bus => {
            const marker = new AdvancedMarkerElement({
                map,
                position: { lat: bus.vehicle.position.latitude, lng: bus.vehicle.position.longitude }, // assuming lat/lng properties are available
                //content: img, // Default to bus icon if type is missing
            });
            markersOnMap.push(marker); // Store marker to track it
        });

        //console.log(rail[0].VEHICLELATITUDE)
        rail.forEach(train => {
            const marker = new AdvancedMarkerElement({
                map,
                position: { lat: parseFloat(train.VEHICLELATITUDE), lng: parseFloat(train.VEHICLELONGITUDE) }, // assuming lat/lng properties are available
                //content: img, // Default to bus icon if type is missing
            });
            markersOnMap.push(marker); // Store marker to track it
        });
        
    } catch (error) {
        console.error('Error fetching vehicle data:', error);
    }
}

initMap();
window.initMap = initMap;