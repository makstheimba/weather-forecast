function geolocation_error(error) {
    if (error.code === error.PERMISSION_DENIED) {
        alert("Permission denied");
    }
}

function fromKtoC(temp) {return Math.round(temp - 273.15); }
function fromCtoF(temp) {return Math.round(temp * 1.8 + 32); }
function fromFtoC(temp) {return Math.round((temp - 32) * 0.5556); }
String.prototype.capitalize = function () {return this.charAt(0).toUpperCase() + this.slice(1); };

function setWeather(position, infoWindow) {
    var key_API = "79074fb5ab975a3c6212bf1622443b79",
        request_URL = "http://api.openweathermap.org/data/2.5/weather?lat=" +
            position.lat + "&lon=" + position.lng + "&appid=" + key_API,
        test_data = "data/weather.json";
    $.ajax({
        url: test_data,//change this to request_URL after testing
        //url: request_URL,
        success: function (weather) {
            var location = weather.name,
                temp = weather.main.temp,
                humidity = weather.main.humidity,
                description = weather.weather[0].description,
                wind = weather.wind.speed;
            infoWindow.setContent("<div style='color:blue'>T:</div> " + fromKtoC(temp) 
                                  + "; Humidity:" + humidity + ";<br>" + description);//style infoWindow here
        },
        error: function () {
            alert("Can't get weather");
        }
    });
}

function setHomeLocation(map, infoWindow, setPosition) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            setPosition({lat: position.coords.latitude, lng: position.coords.longitude});
        }, geolocation_error);
    } else {
        alert("Navigation is not supported by your browser");
    }
}

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 0, lng: 0},
        mapTypeId: "hybrid",
        zoom: 4
    }),
        infoWindow = new google.maps.InfoWindow();
    
    map.addListener('click', function (event) {
        var position = {lat: event.latLng.lat(), lng: event.latLng.lng()};
        infoWindow.setPosition(position);
        setWeather(position, infoWindow);
        infoWindow.open(map);
    });
    
    setHomeLocation(map, infoWindow, function (position) {
        map.setCenter(position);
        infoWindow.setPosition(position);
        setWeather(position, infoWindow);
        infoWindow.open(map);
    });
}

$(document).ready(function () {
    initMap();
});
