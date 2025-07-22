/**Variables needed **/
let cityName = document.getElementById('city-name');
let cityTemp = document.getElementById('metric');
let weatherMain = document.querySelectorAll('.weather-main');
let mainHumidity = document.getElementById('humidity');
let feelsLike = document.getElementById('feels-like');
let weatherImg = document.querySelector('.weather-icon');
let weatherTodayImg = document.querySelector('.weather-today-icon');
let tempMinWeather = document.getElementById('temp-min-today');
let tempMaxWeather = document.getElementById('temp-max-today');

/** API Key **/
let apiKey = "1e3e8f230b6064d27976e41163a82b77";

/** Get needed data from the API After Grant Location permission **/

navigator.geolocation.getCurrentPosition(
  /** on Success Callback function **/
  async pos => {
    try {
      var latitude = pos.coords.latitude;
      var longitude = pos.coords.longitude;
      /** latitude and longitude are used to get the city name **/
      var map = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=5&appid=${apiKey}`);

      var userData = await map.json();
      var loc = userData[0].name;
      console.log("Your location is : ",loc);
      /**  Get Weather details of that city using OpenWeatherMap API **/
      let url = `https://api.openweathermap.org/data/2.5/forecast?&units=metric&`;
      
      let response = await fetch(url + `q=${loc}&` + `appid=${apiKey}`);
      let weatherData = await response.json();

      console.log("Weather details : ",weatherData);

      /** Updating Weather info : cityName, temperature(min,max), humidity, weather status **/
      cityName.innerHTML = weatherData.city.name;
      cityTemp.innerHTML = Math.floor(weatherData.list[0].main.temp) + "°";
      weatherMain.forEach(el=>{
        el.innerHTML = weatherData.list[0].weather[0].description;
      });
      mainHumidity.innerHTML = weatherData.list[0].main.humidity;
      feelsLike.innerHTML = Math.floor(weatherData.list[0].main.feels_like);
      tempMinWeather.innerHTML = Math.floor(weatherData.list[0].main.temp_min) + "°";
      tempMaxWeather.innerHTML = Math.floor(weatherData.list[0].main.temp_max) + "°";

      // Get Weather Condition 
      let weatherCondition = weatherData.list[0].weather[0].main.toLowerCase();
      /** Updating images based on weather condition (for the current day)**/
      if(weatherCondition==='rain'){
        weatherImg.src = "public/rain.png";
        weatherTodayImg.src = "public/rain.png";
      }else if(weatherCondition === 'clear' || weatherCondition === 'clear sky'){
        weatherImg.src = "public/sun.png";
        weatherTodayImg.src = "public/sun.png";
      }else if(weatherCondition === 'snow'){
        weatherImg.src = "public/snow.png";
        weatherTodayImg.src = "public/snow.png";
      }else if(weatherCondition === 'clouds' || weatherCondition === 'smoke'){
        weatherImg.src = "public/cloud.png";
        weatherTodayImg.src = "public/cloud.png";
      }else if(weatherCondition === 'fog' || weatherCondition === 'mist'){
        weatherImg.src = "public/mist.png";
        weatherTodayImg.src = "public/mist.png";
      }else if(weatherCondition === 'haze'){
        weatherImg.src = "public/haze.png";
        weatherTodayImg.src = "public/haze.png";
      }else if(weatherCondition === 'thunderstorm'){
        weatherImg.src = "public/thunderstorm.png";
        weatherTodayImg.src = "public/thunderstorm.png";
      }

      /**  Fetch and Display 5 Days Forecast **/
      const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${weatherData.city.name}&appid=${apiKey}&units=metric`;

      fetch(forecastURL)
      .then(res=>res.json())
      .then(data=>{
        console.log("5 Days forecast for : ",data.city.name);
        /**  Displaying 5 Days foreCast **/
         displayForecast(data);
      })
      .catch(error=>{
        console.error("Error fetching foreCast : ",error);
      })
    } catch (error) {
      console.error("An error occured : ",error);
    }
  
    function displayForecast(data) {
      const dailyForecasts = {};
      let forecast = document.getElementById('future-forecast-box');
      let forecastBox = '';
      data.list.forEach(item=>{
        const date = item.dt_txt.split(' ')[0];
        let dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        let day = new Date(date).getDay();
        
        if (!dailyForecasts[date]) {
          dailyForecasts[date] = {
            day_today : dayName[day],
            temperature : Math.floor(item.main.temp) + '°',
            description : item.weather[0].description,
            weatherImg : item.weather[0].main.toLowerCase(),
          };
        }
      });

      // Updating images for 5 Days forecast images 
      for (const date in dailyForecasts) {
        let imgSrc = "";

        switch (dailyForecasts[date].weatherImg) {
          case 'rain':
            imgSrc = "public/rain.png";
            break;
          case 'clear':
          case 'clear sky':
            imgSrc = 'public/sun.png';
            break;
          case 'snow': 
            imgSrc = 'public/snow.png';
            break;
          case 'clouds':
          case 'smoke':
            imgSrc = 'public/cloud.png';
            break;
          case 'mist':
            imgSrc = 'public/mist.png';  
            break;
          case 'haze':
            imgSrc = 'public/haze.png';
            break;
          case 'thunderstorm':
            imgSrc = 'public/thunderstorm.png';
            break;  
          default:
            imgSrc = "public/sun.png";
            break;
        }

        // Displaying 5 Days forecast
        forecastBox += `
          <div class="swiper-slide bg-white rounded-xl shadow-md p-4 text-center hover:scale-105 transition-transform">
              <h2 class="font-semibold text-blue-500 mb-2">${dailyForecasts[date].day_today}</h2>
              <img src="${imgSrc}" alt="" class="w-12 h-12 mx-auto mb-2"/>
              <p class="text-lg font-bold">${dailyForecasts[date].temperature}</p>
              <p class="text-sm text-gray-500">${dailyForecasts[date].description}</p>
            </div>
        `
      }

      forecast.innerHTML = forecastBox;
    }

    }
,
  /** on Faillure Callback **/
  ()=>{
    console.log("Please turn on your location & refresh the page !");
  }
);

/**  SwiperJs slider **/
document.addEventListener("DOMContentLoaded", () => {
      new Swiper(".swiper", {
         spaceBetween: 20,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        scrollbar: {
          el: ".swiper-scrollbar",
          draggable: true,
        },
        breakpoints: {
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 }
        }
      });
    });



