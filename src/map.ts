import * as L from 'leaflet';
import displayForm from './form';

export const displayMapPopup = (coords: [number, number], map: L.Map, body: string): void => {
  L.marker(coords)
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: 'running-popup',
      })
    )
    .setPopupContent(body)
    .openPopup();
};

const displayMap = (): void => {
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        const coords: [number, number] = [latitude, longitude];
        const map = L.map('map').setView(coords, 13);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        map.on('click', (mapEvent) => {
        //   const { lat, lng } = mapEvent.latlng;
        //   displayForm([lat, lng], map, displayMapPopup);
        });
      },
      () => {
        alert('Não consegui descobrir sua localização :(');
      }
    );
};

export default displayMap;
