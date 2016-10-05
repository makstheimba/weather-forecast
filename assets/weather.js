function geolocation_error(error) {
    if (error.code === error.PERMISSION_DENIED) alert("Permission denied");
}

function geolocation_success(map){    
    return function(position){
        map.setCenter({lat: position.coords.latitude, lng: position.coords.longitude});
    };
}

function getWeather(position) {
    var key_API = "79074fb5ab975a3c6212bf1622443b79",
        request_URL = "http://api.openweathermap.org/data/2.5/weather?lat=" +
        position.coords.latitude + "&lon=" + position.coords.longitude + "&appid=" + key_API,
        test_data = "data/weather.json",
        weather = {};    
    $.ajax({
        url: test_data,//change this to request_URL after testing
        success: function (data) {
            weather = data;//delete this if using real request 
            //weather = JSON.parse(data);
            //console.log(weather);
            let location = weather.name,
                temp = weather.main.temp,
                humidity = weather.main.humidity,
                description = weather.weather[0].description,
                wind = weather.wind.speed;
            $("#location").html(location);
            $("#temp").html(fromKtoC(temp)+"&#8451;");
            $("#description").html(description.capitalize());
            $("#wind").html(wind+"mph");
            $("#humidity").html(humidity+"%");
            //$("body").css("background-color", "rgb("+temp+", 0,"+humidity+")");
        },
        error: function () {
            alert("Can't get weather");
        },
    });
}

function getLocation(map) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geolocation_success(map), geolocation_error);
    }
    else {
        alert("Navigation is not supported by your browser");
    }
}

function fromKtoC(temp) {
    return Math.round(temp-273.15);
}

function fromCtoF(temp) {
    return Math.round(temp*1.8+32);
}

function fromFtoC(temp) {
    return Math.round((temp-32)*.5556);
}
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase()+this.slice(1);
}

function initMap() {
    var myLatLng = {lat: 0, lng: 0};
    return new google.maps.Map(document.getElementById('map'), {
      center: myLatLng,
      scrollwheel: false,
      zoom: 4
    });

    // Create a marker and set its position.
    /*var marker = new google.maps.Marker({
      map: map,
      position: myLatLng,
      title: 'Hello World!'
    });*/
  }

$(document).ready(function () {
    var map = initMap();
    console.log('sss');
    getLocation(map);
});
