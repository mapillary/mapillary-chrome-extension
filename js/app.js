(function() {
    'use strict';
    
    function RandomMapillary(locations) {
        var mapillaryUrl = 'https://www.mapillary.com/app/?pKey=',
            mapillaryImageUrl = 'https://d1cuyjsrcm0gby.cloudfront.net/',
            mapillaryMapUrl = 'http://mapillary-staticmaps.mapillary.io/v3/staticmap/image/180/180/',
            nextImageKey = 'nextImage',
            nextDataUrlKey = 'nextDataUrl';
        
        this.getRandomLocation = function() {
            var nextImage = localStorage.getItem(nextImageKey);
            if (nextImage) {
                localStorage.removeItem(nextImageKey);
                var image = JSON.parse(nextImage)
                image.isPreloaded = true;
                return image;
            }
            return locations[Math.floor(Math.random() * locations.length)];            
        }
        
        this.setBackgroundImage = function(image) {
            var backgroundImage = new Image(),
                imageUrl = mapillaryImageUrl + image.key + '/thumb-2048.jpg';
            
             if (image.isPreloaded) {
                return new Promise(function(resolve) {
                    resolve(localStorage.getItem(nextDataUrlKey));
                })
            } 
                
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

        this.setMapImage = function(key) {
            var backgroundImage = new Image(),
                imageUrl = mapillaryMapUrl + key + '.png?zoom=3&style=mapbox_streets';
                
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

        this.preloadNextImage = function(image) {
            var imageUrl = mapillaryImageUrl + image.key + '/thumb-2048.jpg';

            var xmlHTTP = new XMLHttpRequest();
            xmlHTTP.open("GET", imageUrl, true);
            xmlHTTP.responseType = "blob";
            xmlHTTP.timeout = 15000;

            xmlHTTP.onload = function() {
                if (xmlHTTP.status !== 200) {
                    return;
                }
                localStorage.removeItem(nextImageKey);
                localStorage.removeItem(nextDataUrlKey);
                var reader = new FileReader();
                reader.onloadend = function() {
                    localStorage.setItem(nextImageKey, JSON.stringify(image));
                    localStorage.setItem(nextDataUrlKey, reader.result);
                }
                reader.readAsDataURL(xmlHTTP.response);
            };

            xmlHTTP.send(null); 
        } 
        
        this.init = function() {
            var self = this,
                location = this.getRandomLocation(),
                background = document.getElementById('background'),
                exploreButton = document.getElementById('explore'),
                map = document.getElementById('map'),
                osm = document.getElementById('osm'),
                shareMenu = new ShareMenu(mapillaryUrl + location.key);
                
            this.setBackgroundImage(location).then(function(imageUrl) {
                background.style.backgroundImage = "url('" + imageUrl + "')";
                background.style.opacity = "1";
                self.preloadNextImage(self.getRandomLocation());
            })

            this.setMapImage(location.key).then(function(imageUrl) {
                map.style.backgroundImage = "url('" + imageUrl + "')";
                map.style.opacity = "0.9";   
                map.href = mapillaryUrl + location.key + '&focus=map';
                osm.style.opacity = "1";
                osm.href = 'https://www.openstreetmap.org/#map=15/' + location.lat + '/' + location.lon;
            })

            exploreButton.href = mapillaryUrl + location.key + '&focus=photo';

        }
        
        this.init();
    }

    function ShareMenu(url) {
        var shareUrls = {
            facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
            twitter: 'https://twitter.com/share?text=',
            googlePlus: 'https://plus.google.com/share?url=',
            tumblr: 'https://www.tumblr.com/share/link?url=',
            email: 'mailto:?body='
        },
        defaultTwitterText = 'Check out this photo on @mapillary:',
        defaultEmailSubject = '&Subject=Check out this photo on Mapillary';
        
        this.init = function() {
            var options = document.getElementsByClassName('share-option'),
                shareButton = document.getElementById('share-button'),
                shareMenu = document.getElementById('share-menu');
                        
            options[0].href = shareUrls.facebook + url;
            options[1].href = shareUrls.twitter + defaultTwitterText + '&url=' + url;
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
