import axios from "axios";

const form = document.querySelector("form");
const addressInput = document.getElementById("address")! as HTMLInputElement;
let map: google.maps.Map;

const GOOGLE_API_KEY = "AIzaSyB32qjwfBF4n_OVQtrzFkhZOHcXzbMzuqw";
type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: "OK" | "ZERO_RESULTS";
};

//Inicializace mapy v div with id: map
function initMap(lat: number, lng: number): void {
  map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    center: { lat: lat, lng: lng },
    zoom: 16,
  });

  new google.maps.Marker({
    position: { lat: lat, lng: lng },
    map: map,
  });
}

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;

  axios
    .get<GoogleGeocodingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        enteredAddress
      )}&key=${GOOGLE_API_KEY}
  `
    )
    .then((response) => {
      if (response.data.status !== "OK") {
        throw new Error("Could not fetch location");
      } else {
      }
      console.log(response);
      const coordinates = response.data.results[0].geometry.location;
      console.log(coordinates);
      // Remove the <p>Please enter an address!</p> element
      const mapElement = document.getElementById("map")!;
      mapElement.innerHTML = "";

      // Initialize the map with the fetched coordinates
      initMap(coordinates.lat, coordinates.lng);
    })
    .catch((err) => {
      alert(err.message);
      console.log(err);
    });
  // axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${enteredAddress}&key=${GOOGLE_API_KEY}
  // `);
}

form?.addEventListener("submit", searchAddressHandler);
