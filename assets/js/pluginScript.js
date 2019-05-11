// Engine list
searchengine = {
  "none": {"url": "none", "holder": "none"},
  "ddg": {"url": "https://duckduckgo.com", "holder": "Search on DuckDuckGo..."},
  "bing": {"url": "https://www.bing.com/search", "holder": "Search on Bing..."},
  "searx": {"url": "https://searx.owo.cloud", "holder": "Search on OwO searX..."},
  "yahoo": {"url": "https://search.yahoo.com/search", "holder": "Search on Yahoo..."}
}


// HEX Time
function pad(n) { return ("0" + n).slice(-2); }
function getHexTime() {
  var now = new Date();
  var hour = pad(now.getHours());
  var minute = pad(now.getMinutes());
  var second = pad(now.getSeconds());
  return hour.toString() + minute.toString() + second.toString();
}


// 3 hour difference creator
function newWeatherTime(target, items, data) {
  var element = document.createElement("div");
  var wlIcon = document.createElement("img");
  var wlText = document.createElement("p");
  element.className = "wdiff";
  wlText.className = "text";
  wlIcon.className = "icon";

  if (items.tempc == false) {
    var getTemp = `${Math.round(parseInt(data.main.temp) * (9 / 5) - 459.67)} °F`
  } else {
    var getTemp = `${Math.round(parseInt(data.main.temp) - 273.15)} °C`
  }

  wlIcon.src = wicons[data.weather[0].icon];
  var getTime = moment.unix(data.dt).format("LT")
  var getDesc = data.weather[0].description.replace(/^\w/, c => c.toUpperCase())
  wlText.innerText = `${getTime} - ${getDesc} | ${getTemp}`;

  element.appendChild(wlIcon);
  element.appendChild(wlText);
  target.appendChild(element);
}


// Request function
var http = function (url, callback) {
  if (!window.XMLHttpRequest) return console.log("This browser does not support requests");
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.setRequestHeader('Access-Control-Allow-Headers', '*');
  request.onload = function () {
    if (this.status >= 200 && this.status < 400) {
      var json = JSON.parse(this.response);
      if (callback && typeof(callback) === 'function') {
        callback(json);
      }
    }
  };
  request.send(null);
}


// Weather API icons
var wicons = {
  '01d': 'https://raw.githubusercontent.com/twitter/twemoji/gh-pages/72x72/2600.png',
  '02d': 'https://raw.githubusercontent.com/twitter/twemoji/gh-pages/72x72/26c5.png',
  '03d': 'https://raw.githubusercontent.com/twitter/twemoji/gh-pages/72x72/2601.png',
  '04d': 'https://raw.githubusercontent.com/twitter/twemoji/gh-pages/2/72x72/1f327.png',
  '09d': 'https://raw.githubusercontent.com/twitter/twemoji/gh-pages/2/72x72/1f327.png',
  '10d': 'https://raw.githubusercontent.com/twitter/twemoji/gh-pages/2/72x72/1f326.png',
  '11d': 'https://cdn.discordapp.com/attachments/132632676225122304/270190320736534538/emoji.png',
  '13d': 'https://raw.githubusercontent.com/twitter/twemoji/gh-pages/2/72x72/1f328.png',
  '50d': 'https://raw.githubusercontent.com/twitter/twemoji/gh-pages/2/72x72/1f32b.png',
  '01n': 'https://raw.githubusercontent.com/twitter/twemoji/gh-pages/2/72x72/1f311.png',
  '02n': 'https://raw.githubusercontent.com/twitter/twemoji/gh-pages/72x72/26c5.png',
  '03n': 'https://raw.githubusercontent.com/twitter/twemoji/gh-pages/72x72/2601.png',
  '04n': 'https://raw.githubusercontent.com/twitter/twemoji/gh-pages/2/72x72/1f327.png',
  '09n': 'https://raw.githubusercontent.com/twitter/twemoji/gh-pages/2/72x72/1f327.png',
  '10n': 'https://raw.githubusercontent.com/twitter/twemoji/gh-pages/2/72x72/1f326.png',
  '11n': 'https://cdn.discordapp.com/attachments/132632676225122304/270190320736534538/emoji.png',
  '13n': 'https://raw.githubusercontent.com/twitter/twemoji/gh-pages/2/72x72/1f328.png',
  '50n': 'https://raw.githubusercontent.com/twitter/twemoji/gh-pages/2/72x72/1f32b.png',
}

// Load that sweet plugin script
document.addEventListener('DOMContentLoaded', function() {
  // Load custom settings
  chrome.storage.local.get({
    language: "",
    custombg: "",
    customfont: "",
    customfontgoogle: false,
    engines: "google",
    wkey: "",
    w3hours: false,
    wlang: "en",
    tempc: true,
    hexbg: false,
    links: "",
    googleapps: false,
    showSettings: true,
    customcss: ""
  }, function(items) {
    if (items.custombg.length) {
      var chooseranbg = items.custombg.split("\n");
      var chooseranbgindex = Math.floor(Math.random() * chooseranbg.length);
      backgroundElement.src = chooseranbg[chooseranbgindex];
    }

    if (items.language) { moment.locale(items.language); }

    if (items.customfont) {
      addFont = '"' + items.customfont + '", "Lato", sans-serif, Arial';
      if (items.customfontgoogle) {
        gFont = document.createElement("link");
        gFont.href = "https://fonts.googleapis.com/css?family=" + items.customfont.replace(" ", "+")
        gFont.rel = "stylesheet";
        document.head.appendChild(gFont);
      }
      document.body.style.fontFamily = addFont;
    }

    if (items.customcss) {
      cssEl = document.createElement("style");
      cssEl.type = "text/css";
      cssEl.innerText = items.customcss;
      document.head.appendChild(cssEl);
    }

    if (items.hexbg) {
      backgroundElement.src = "";
      function timeInHex() {
        document.body.style.backgroundColor = "#" + getHexTime("hex");
        setTimeout(timeInHex, 50); // Repeat every 0.1 seconds
      }
      timeInHex();
    }

    if (items.wkey) {
      navigator.geolocation.getCurrentPosition(function(position) {
        pos = position.coords;
        http(`https://api.openweathermap.org/data/2.5/forecast?lat=${pos.latitude}&lon=${pos.longitude}&lang=${items.wlang}&APPID=${items.wkey}`, function(r) {
          document.getElementById('wicon').src = wicons[r.list[0].weather[0].icon]
          document.getElementById('wname').innerText = r.city.name
          document.getElementById('wdescription').innerText = r.list[0].weather[0].description.replace(/^\w/, c => c.toUpperCase());
          if (items.tempc == false) {
            document.getElementById('wtemp').innerText = `${Math.round(parseInt(r.list[0].main.temp) * (9 / 5) - 459.67)} °F`
          } else {
            document.getElementById('wtemp').innerText = `${Math.round(parseInt(r.list[0].main.temp) - 273.15)} °C`
          }

          document.getElementById('wcontainer').style.display = "block";

          // Make all the other time differences if enabled
          var wLater = document.getElementById('wtime-container');
          if (items.w3hours) {
            for (i = 1; i < 5; i++) {
              newWeatherTime(wLater, items, r.list[i]);
            }
          }

        })

      });
    }

    if (items.engines !== "google") {
      if (items.engines == "none") {
        document.getElementById('formsearch').style.display = "none";
      }
      document.getElementById('formsearch').action = searchengine[items.engines].url;
      document.getElementById('forminput').placeholder = searchengine[items.engines].holder;
    }

    // Quick links
    if (items.links) {
      var screenH = document.getElementById('js-bg').getBoundingClientRect().height - 65
      var links = items.links.split('\n').slice(0, Math.floor((window.innerHeight - 65) / 40))
      if (links.length * 52 > screenH) {
        document.getElementById('quicklinks').classList.add('compact')
      }

      for (var i = 0; i < links.length; i++) {
        (function (lnk) {
          if (lnk.length) {
            setTimeout(async function () {
              var link = document.createElement('a')
              var img = document.createElement('img')
              var txt = document.createElement('span')

              link.classList.add('quicklink')
              link.classList.add('load')
              setTimeout(function () {
                link.classList.remove('load')
              }, 810)
              link.setAttribute('href', lnk)

              img.classList.add('quicklink-icon')
              img.setAttribute('src', 'https://cdn.bowser65.xyz/i/web.png')

              txt.classList.add('quicklink-txt')
              txt.innerText = lnk

              link.appendChild(img)
              link.appendChild(txt)
              document.getElementById('quicklinks').appendChild(link)

              const resp = await fetch(`https://api.bowser65.xyz/favicon/${encodeURIComponent(lnk)}`)
              const json = await resp.json()
              if (json.icon) {
                img.setAttribute('src', json.icon)
              }
            }, i * 200)
          }
        })(links[i])
      }
    }

    if (items.showSettings) {
      var settings = document.getElementById('settings');
      settings.removeAttribute('style');
      settings.addEventListener('click', function () {
        chrome.runtime.openOptionsPage();
      })
    }

    if (items.googleapps) {
      document.getElementById('googleapps').style.display = "block";
      document.getElementById('googleapps-btn').style.display = "flex";
    }

  })

}, false);
