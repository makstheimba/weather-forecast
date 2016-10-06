function fromKtoC(temp) {return Math.round(temp - 273.15); }
function fromCtoF(temp) {return Math.round(temp * 1.8 + 32); }
function fromFtoC(temp) {return Math.round((temp - 32) * 0.5556); }
function deg(x){return x<45?0:x<135?90:x<225?180:x<315?270:0; }

function geolocation_error(error) {
    if (error.code === error.PERMISSION_DENIED) {
        console.log("Permission denied");
    }
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

function setWeather(position, infoWindow) {
    var key_API = "79074fb5ab975a3c6212bf1622443b79",
        request_URL = "http://api.openweathermap.org/data/2.5/weather?lat=" +
            position.lat + "&lon=" + position.lng + "&appid=" + key_API;
    $.ajax({
        url: request_URL,
        success: function (weather) {
            console.log(weather);
            var location = weather.name,
                temp = weather.main.temp,
                humidity = weather.main.humidity,
                wind = Math.round(weather.wind.speed),
                icon = ("<img id='weather-icon' src='http://openweathermap.org/img/w/" + weather.weather[0].icon + ".png'>"),
                direction = "fa-rotate-" + deg(weather.wind.deg);
                
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
            
        },
        error: function () {
            alert("Can't get weather");
        }
    });
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
        infoWindow.setContent('');
        setWeather(position, infoWindow);
        infoWindow.open(map);
    });
    
    setHomeLocation(map, infoWindow, function (position) {
        map.setCenter(position);
        infoWindow.setPosition(position);
        infoWindow.setContent('');
        setWeather(position, infoWindow);
        infoWindow.open(map);
    });
}

$(document).ready(function () {
    initMap();
    $("body").on("click", "#temp", function () {
        var temperature = $(this).html();
        if (temperature.slice(-1) === '\u2103') {
            $(this).html(fromCtoF(parseInt(temperature)) + '\u2109');
        } else {
            $(this).html(fromFtoC(parseInt(temperature)) + '\u2103');
        }
    });
});