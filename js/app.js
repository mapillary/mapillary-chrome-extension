(function() {
    'use strict';
    
    function RandomMapillary(locations) {
        var clientId = '<your client id here>',
            mapillaryUrl = 'https://www.mapillary.com/map/im/',
            mapillaryImageUrl = 'https://d1cuyjsrcm0gby.cloudfront.net/';
        
        this.getRandomLocation = function() {
            return locations[Math.floor(Math.random() * locations.length)];            
        }
        
        this.setBackgroundImage = function(sequence) {
            var backgroundImage = new Image(),
                imageUrl = mapillaryImageUrl + sequence + '/thumb-2048.jpg';
                
            return new Promise(function(resolve, reject) {
                backgroundImage.onload = function() {
                    resolve(imageUrl);
                }
                backgroundImage.onerror = function() {
                    reject();
                }
                backgroundImage.src = imageUrl
            })
        }
        
        this.showMap = function(location) {
            var map = L.map('map', {zoomControl: false}),
                osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',              
                osmAttrib = '© <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
                osm = new L.TileLayer(osmUrl, { maxZoom: 18, attribution: osmAttrib}),
                marker = L.marker({
                    lat: location.lat,
                    lon: location.lon
                });
                
            map.addLayer(osm);
            map.setView([location.lat, location.lon], 1);
            marker.addTo(map);
            
            document.getElementById('map').href = mapillaryUrl + location.key + '/map';
        }
        
        this.loadMapillaryJS = function() {
            var script = document.createElement("script");
            script.src = "/node_modules/mapillary-js/dist/mapillary-js.min.js";
            script.type = "text/javascript";
            document.head.appendChild(script);
        }
       
        this.setMapillaryView = function(sequence) {
            var viewer = new Mapillary.Viewer('mly',
            clientId,
            sequence,
            {
                cover: false,
                renderMode: Mapillary.RenderMode.Fill
            });
            window.addEventListener("resize", function() { viewer.resize(); });
        }
        
        this.init = function() {
            var self = this,
                location = this.getRandomLocation(),
                background = document.getElementById('background'),
                exploreButton = document.getElementById('explore'),
                shareMenu = new ShareMenu(mapillaryUrl + location.key);
                
            this.setBackgroundImage(location.key).then(function(imageUrl) {
                background.style.backgroundImage = "url('" + imageUrl + "')";
                background.style.opacity = "1";
                self.showMap(location);
                self.loadMapillaryJS();
            })
            
            exploreButton.onclick = function() {
                self.setMapillaryView(location.key);
                background.style.opacity = 0;
                setTimeout(function() {background.style.display = 'none';}, 300) 
            };
        }
        
        this.init();
    }

    function ShareMenu(url) {
        var shareUrls = {
            facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
            twitter: 'https://twitter.com/share?text=',
            googlePlus: 'https://plus.google.com/share?url=',
            tumblr: 'http://www.tumblr.com/share/link?url=',
            email: 'mailto:?body='
        },
        defaultTwitterText = 'Check out this photo on @mapillary:',
        defaultEmailSubject = '&Subject=Check out this photo on Mapillary';
        
        this.init = function() {
            var options = document.getElementsByClassName('share-option'),
                shareButton = document.getElementById('share-button'),
                shareMenu = document.getElementById('share-menu');
                        
            options[0].href = shareUrls.facebook + url;
            options[1].href = shareUrls.twitter + defaultTwitterText + url;
            options[2].href = shareUrls.googlePlus + url;
            options[3].href = shareUrls.tumblr + url;
            options[4].onclick = function() {
                chrome.tabs.create({url: shareUrls.email + url + defaultEmailSubject});
            }
            
            shareButton.onclick = function() {
                if (shareMenu.classList.contains('open')) {
                    shareMenu.classList.remove('open');
                } else {
                    shareMenu.classList.add('open');
                }
            }
        }
        
        this.init();
    }

    fetch('/data.json')
        .then(function(response) {
            return response.json();
        }).then(function(data) {
            var randomMapillary = new RandomMapillary(data.savedLocations);
        });

})();
