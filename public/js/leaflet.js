/* eslint-disable */
export const displayMap = locations => {
  const map = L.map('map', { zoomControl: false });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    crossOrigin: ''
  }).addTo(map);

  const points = [];
  const latlngs = []; // Array to store the latlngs for the polyline

  //* Define custom icon for start location
  const startIcon = L.icon({
    iconUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Map_pin_icon_green.svg/752px-Map_pin_icon_green.svg.png', // Replace with your icon URL
    iconSize: [32, 42], // Size of the icon
    iconAnchor: [16, 32] // Anchor point of the icon
  });

  //* Define custom icon for end location
  const endIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/11590/11590229.png', // Replace with your icon URL
    iconSize: [46, 46], // Size of the icon
    iconAnchor: [27, 30] // Anchor point of the icon
  });

  //* Define custom icon for default locations
  const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', // Replace with your icon URL
    iconSize: [32, 38], // Size of the icon
    iconAnchor: [15, 32] // Anchor point of the icon
  });

  locations.forEach((loc, index) => {
    const latlng = [loc.coordinates[1], loc.coordinates[0]];
    points.push(latlng);
    latlngs.push(latlng);

    //* Choose the icon based on the index (start, end, or other locations)
    let icon;
    if (index === 0) {
      icon = startIcon;
    } else if (index === locations.length - 1) {
      icon = endIcon;
    } else {
      icon = defaultIcon;
    }

    L.marker(latlng, { icon: icon })
      .addTo(map)
      .bindPopup(
        `<p>${
          index === 0
            ? `Start Location Day ${loc.day}`
            : index === locations.length - 1
            ? `End Location ${loc.day}`
            : `Day ${loc.day}`
        }: ${loc.description}</p>`,
        { autoClose: false }
      )
      .openPopup();
  });

  //* Add polyline to connect the points
  L.polyline(latlngs, { color: 'blue', weight: 1, opacity: 10 }).addTo(map);

  const bounds = L.latLngBounds(points).pad(0.5);
  map.fitBounds(bounds);

  map.scrollWheelZoom.disable();
};
