let map;
let vehicleMarkers = [];

function initMap() {
    map = new google.maps.Map(document.getElementById("map", {
        center: new google.maps.LatLng(33.7488, -84.3877),
        zoom: 14,
        mapId: "338bf3676ad5446b"
    }));
}

const icons = {
    bus: {
        icon: "./resources/60.png",
    },
    train: {
        icon: "./resources/60.png".at,
    }
};

/*
for (let i=0; i < vehicleMarkers; i++) {
    const marker = new google.maps.Marker({
        position: vehicleMarkers[i].position,
        icon: icons[vehicles[i].type].icon,
        map: map,
    })
}
*/


window.initMap = initMap;