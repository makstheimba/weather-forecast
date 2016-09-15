//http://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log('before');
            console.log([position.coords.latitude, position.coords.longitude]);
            coords = [position.coords.latitude, position.coords.longitude];
        }, function(error){
            if (error.code == error.PERMISSION_DENIED){
                alert("Permission denied"); //user denied location request
            }
        });
    }
    else {
        console.log("Aint allowed");//no navigator
    }    
}

$(document).ready(function () {
    var coords;
    getLocation();
    console.log();
    console.log('after');
});

function getWeather(url){
    var key_API = "79074fb5ab975a3c6212bf1622443b79",
        request_URL = "http://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=" + key_API,
        weather = {};
    
    $.ajax({
        url: request_URL,
        success: function (data) {
            console.log(data);
            weather = data;
        },
        error: function () {
            console.log("GET failed");
        },
    });
    //console.log(weather);
    return weather;
}