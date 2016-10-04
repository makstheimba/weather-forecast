function handle_error(error) {
    if (error.code === error.PERMISSION_DENIED) alert("Permission denied");
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

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getWeather, handle_error);
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

$(document).ready(function () {
    getLocation();
    $("#temp").click(function (){
        let cur = $(this).html(),
            scale = cur[cur.length-1];
        if (scale === String.fromCharCode(8451)){
            $(this).html(fromCtoF(cur.slice(0,cur.length-1))+"&#8457;");
        }
        else {
            $(this).html(fromFtoC(cur.slice(0,cur.length-1))+"&#8451;");
        }
    });
});
