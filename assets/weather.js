const fromKtoC = temp => Math.round(temp - 273.15)
const fromCtoF = temp => Math.round(temp * 1.8 + 32)
const fromFtoC = temp => Math.round((temp - 32) * 0.5556)
const getIconRotation = angle => angle > 314 ? 0 : 90 * Math.floor((angle + 45) / 90)

const geolocation_error = error => {
    if (error.code === error.PERMISSION_DENIED) {
        alert("Can't find you without permission :(");
    }
}

const setHomeLocation = (map, infoWindow, setPosition) => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            setPosition({lat: position.coords.latitude, lng: position.coords.longitude});
        }, geolocation_error);
    } else {
        alert("Navigation is not supported by your browser");
    }
}

const setInfoWindowInfo = (infoWindow, weather) => {
    const location = weather.name;
    const temp = weather.main.temp;
    const humidity = weather.main.humidity;
    const wind = Math.round(weather.wind.speed);
    const icon = ("<img id='weather-icon' src='http://openweathermap.org/img/w/" + weather.weather[0].icon + ".png'>");
    const direction = "fa-rotate-" + getIconRotation(weather.wind.deg);
        
    infoWindow.setContent(
        '<div class="weather-box" id="weather-box">' + icon +
        '<h1 id="location">' + location + '</h1>' +
        '<div id="temp">' + fromKtoC(temp) + '&#x2103</div>' +
        '<div class="wh-box">' +
        '<div id="humid"><i class="fa fa-tint"></i> ' + humidity + '<span class="measure">%</span></div>' +
        '<div id="wind"><i class="fa fa-arrow-circle-o-down ' + direction + '"></i> ' + wind +
        '<span style="font-size:50%">mph</span></div>' +
        '</div></div>'
    );
}

const getWeather = (position, infoWindow) => {
    const key_API = "79074fb5ab975a3c6212bf1622443b79";
    const request_URL = ("http://api.openweathermap.org/data/2.5/weather?lat=" +
            position.lat + "&lon=" + position.lng + "&appid=" + key_API
    );

    $.ajax({
        url: request_URL,
        success: weather => setInfoWindowInfo(infoWindow, weather),
        error: () => alert("Can't get weather")
    });
}

const initMap = () => {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 0, lng: 0},
        mapTypeId: "hybrid",
        zoom: 4
    });
    const infoWindow = new google.maps.InfoWindow();
        
    map.addListener('click', event => {
        const position = {lat: event.latLng.lat(), lng: event.latLng.lng()};

        infoWindow.setPosition(position);
        infoWindow.setContent('');
        getWeather(position, infoWindow);
        infoWindow.open(map);
    });
    
    setHomeLocation(map, infoWindow, position => {
        map.setCenter(position);
        infoWindow.setPosition(position);
        infoWindow.setContent('');
        getWeather(position, infoWindow);
        infoWindow.open(map);
    });
}

$(document).ready(() => {
    initMap();
    $("body").on("click", "#temp", () => {
        const temperature = $(this).html();
        if (temperature.slice(-1) === '\u2103') {
            $(this).html(fromCtoF(parseInt(temperature, 10)) + '\u2109');
        } else {
            $(this).html(fromFtoC(parseInt(temperature, 10)) + '\u2103');
        }
    });
});