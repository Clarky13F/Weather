$(document).ready(function () {
    var apiKey = "c3e038a1e6ea70fcf40a676e3336da65";
    var searchHistory = [];

    loadSearchHistory();

    $("#search-form").submit(function (e) {
        e.preventDefault();
        var city = $("#city-input").val().trim();

        if (city !== "") {
            getCurrentWeather(city);
            getForecast(city);
            addToSearchHistory(city);
            $("#city-input").val("");
        }
    });

    $("#search-history").on("click", "li", function () {
        var city = $(this).text();
        getCurrentWeather(city);
        getForecast(city);
    });

    function getCurrentWeather(city) {
        var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

        $.ajax({
            url: currentWeatherUrl,
            method: "GET",
            dataType: "json",
            success: function (data) {
                var cityName = data.name;
                var date = new Date(data.dt * 1000);
                var iconUrl = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
                var temperature = data.main.temp;
                var humidity = data.main.humidity;
                var windSpeed = data.wind.speed;


                $("#current-weather").html(`
                <h2>${cityName}</h2>
                <p>Date: ${date.toLocaleDateString()}</p>
                <img src="${iconUrl}" alt="Weather Icon">
                <p>Temperature: ${temperature} &#8457;</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind Speed: ${windSpeed} m/s</p>
            `);
            },
            error: function () {
                $("#current-weather").html("<p>City not found. Please try again.</p>");
            },
        });
    }

    function getForecast(city) {
        var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;


        $.ajax({
            url: forecastUrl,
            method: "GET",
            dataType: "json",
            success: function (data) {
                var forecastList = data.list;


                $("#forecast").empty();
                for (var i = 0; i < forecastList.length; i += 8) {
                    var forecastData = forecastList[i];
                    var date = new Date(forecastData.dt * 1000);
                    var iconUrl = `https://openweathermap.org/img/w/${forecastData.weather[0].icon}.png`;
                    var temperature = forecastData.main.temp;
                    var humidity = forecastData.main.humidity;
                    var windSpeed = forecastData.wind.speed;

                    var forecastCard = `
                    <div class="forecast-card">
                        <p>Date: ${date.toLocaleDateString()}</p>
                        <img src="${iconUrl}" alt="Weather Icon">
                        <p>Temperature: ${temperature} &#8457;</p>
                        <p>Humidity: ${humidity}%</p>
                        <p>Wind Speed: ${windSpeed} m/s</p>
                    </div>`;

                    $("#forecast").append(forecastCard);
                }
            },
            error: function () {
                $("#forecast").html("<p>City not found. Please try again.</p>");
            },
        });
    }

    function addToSearchHistory(city) {
        if (!searchHistory.includes(city)) {
            searchHistory.push(city);
            saveSearchHistory();
            renderSearchHistory();
        }
    }

    function renderSearchHistory() {
        $("#search-history").empty();
        for (var i = 0; i < searchHistory.length; i++) {
            var listItem = $("<li>").text(searchHistory[i]);
            $("#search-history").prepend(listItem);
        }
    }

    function saveSearchHistory() {
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }

    function loadSearchHistory() {
        var storedHistory = localStorage.getItem("searchHistory");
        if (storedHistory) {
            searchHistory = JSON.parse(storedHistory);
            renderSearchHistory();
        }
    }
});