var map;
// this is the non-editable data list of my neighborhood's preferred locations
var locations = [
    {
      title: 'Monteroduni',
      position: {lat: 41.522682, lng: 14.176778}
    },
    {
      title: 'Maschio Angioino',
      position: {lat: 40.838489, lng: 14.252719}
    },
    {
      title: 'Colosseum',
      position: {lat: 41.890210, lng: 12.492232}
    },
    {
      title: 'Stadio San Paolo',
      position: {lat: 40.827936, lng: 14.193061}
    },
    {
      title: 'Stadio Olimpico',
      position: {lat: 41.934078, lng: 12.454725}
    },
    {
      title: 'Teatro Romano di Pietrabbondante',
      position: {lat: 41.739723, lng: 14.387374}
    },
    {
      title: 'Abbazia di San Vincenzo Al Volturno',
      position: {lat: 41.649959, lng: 14.083577}
    },
    {
      title: 'Castello del Pandone, Venafro',
      position: {lat: 41.487632, lng: 14.044584}
    },
    {
      title: 'Fontana Fraterna',
      position: {lat: 41.591943, lng: 14.228660}
    },
    {
      title: 'Teatro San Carlo',
      position: {lat: 40.837485, lng: 14.249638}
    }
];
// Array tha will be populated by knockout
var markers = [];
//Maps and Wikipedia API's methods collection
var googleMapsViewModel = {
    //Method to append wikipedia links to the clicked marker's infowindow
    'appendWikiLinks': function(result) {
        var articles = result[1];
        var links = [];
        if (articles.length === 0) {
          $('.info-window').append('<br><br>No Wikipedia links found for this place!');
          return;
        }
        $('.info-window').append('<br><br>Wikipedia Links: ');
        for(var i = 0; i < articles.length; i++) {
            $('.info-window').append('<div class="wiki-articles"><a href="https://it.wikipedia.org/wiki/' + articles[i] + '">' + articles[i] + '</a></div>');
        }
    },
    'getWikiInfo': function(markerTitle) {
      var self = this;//The googleMapsViewModel
      // resources: https://www.mediawiki.org/wiki/API:Opensearch
      var url = 'https://it.wikipedia.org/w/api.php?action=opensearch&search=' + markerTitle + '&format=json&callback=wikiArticle';
      // If the search fails or takes more than 4 seconds I will notify it to the user
      var requestSetTimeout = setTimeout(function() {
        alert("Failed to get Wikipedia articles for this place");
      }, 4000);
      $.ajax({
        'url': url,
        'dataType': 'jsonp'
      }).done(function(result) {
        self.appendWikiLinks(result);
        clearTimeout(requestSetTimeout);
      }).fail(function(error) {
        alert("A Problem occurred while searching for Wikipedia articles. Please check your Interet connection and try again!");
        clearTimeout(requestSetTimeout);
      });
    },
    'createMarker': function(data, id) {
      var marker = new google.maps.Marker({
        title: data.title,
        position: data.position,
        animation: google.maps.Animation.DROP,
        id: id
      });
      markers.push(marker);
    },
    // resources: https://developers.google.com/maps/documentation/javascript/examples/marker-animations
    'toggleAnimation': function(marker) {
      if (marker.getAnimation()!== null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.DROP);
      }
    },
    'populateInfoWindow': function(marker, infowindow) {
      var title = marker.title;
      // if the infowindow is opened on another market I need to open it on the current one
      if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div class="info-window">' + title + '<br>' +
          'Lat: ' + marker.position.lat() + '; Lng: ' + marker.position.lng() +'</div>');
        this.getWikiInfo(marker.title); // asynchronously retrieves wikipedia links
        infowindow.open(map, marker);
        infowindow.addListener('closeclick', function() {
          infowindow.marker = null;
        });
      }
    },
    'updateMapBounds': function() {
      var bounds = new google.maps.LatLngBounds();
      markers.forEach(function(marker) {
        if (marker.visible == true) {
          bounds.extend(marker.position);
        }
      });
      map.fitBounds(bounds);
    },
    'addListenerToMarkers': function() {
      var self = this;//The googleMapsViewModel
      var infoWindow = new google.maps.InfoWindow();
      var bounds = new google.maps.LatLngBounds();
      markers.forEach(function(marker) {
        marker.setMap(map);
        marker.addListener('click', function() {
          self.toggleAnimation(marker);
          self.populateInfoWindow(marker, infoWindow);
        });
        bounds.extend(marker.position);
      });
      map.fitBounds(bounds);
    }
};

// Knockout ViewModel
function locationsListViewModel() {
  var self = this;
  // this filter will change on user's interaction and cause locations filtering
  self.filter = ko.observable("");
  self.locationsList = ko.observableArray = [];
  self.Location = function(data, id) {
    this.title = ko.observable(data.title);
    this.position = ko.observable(data.position);
    this.visibility = ko.observable(true);
    this.id = ko.observable(id);
  };
  // for each location I will separately create a list-item and a map-marker with the same id
  for (var i = 0; i < locations.length; i++) {
    self.locationsList.push(new self.Location(locations[i], i));
    googleMapsViewModel.createMarker(locations[i], i);
  }
  googleMapsViewModel.addListenerToMarkers(); //It goes ahead with the map feature's implementation

  // when clicking on a list item a 'click' event is triggered on the
  // corresponding marker causing the function populateInfoWindow to be executed
  self.triggerClickOnLocationMarker = function(location) {
    var id = location.id(); // needed to retrieve the related marker
    new google.maps.event.trigger(markers[id], 'click');
  };
  // function that gets executed if the filter button is clicked
  self.filterLocationsList = function() {
    self.locationsList.forEach(function(location) {
      var id = location.id(); // needed to retrieve the related marker
      var string = location.title().toLowerCase(); // string to be checked against the filter
      var visibility;
      if (!self.filter()) {// if no filter is typed, both list items and markers have to be visible
        visibility = true;
      } else {// otherwise their visibility will depend on the following check
        visibility = string.includes(self.filter().toLowerCase());
      }
      // finally, visibility gets applied to the 'list item - marker' pair
      location.visibility(visibility);
      markers[id].setVisible(visibility);
    });
    googleMapsViewModel.updateMapBounds(); // after each filtering the map bounds gets updated
  };
  // these two observables are used to make the page responsive on mobiles
  // resources: http://stackoverflow.com/questions/9897878/how-would-one-make-knockout-js-templates-css-media-query-aware
  // once the page is load the following values are applied:
  self.locationsListIsVisible = ko.observable($(window).width() > 800);
  self.headerIsVisible = ko.observable(!($(window).width() > 800));
  // when window gets resized:
  $(window).resize(function() {
    self.locationsListIsVisible($(window).width() > 800);
    self.headerIsVisible(!($(window).width() > 800));
  });
  // if the #hamburger button is clicked then the list's visibility is triggered
  self.triggerListVisibility = function() {
    self.locationsListIsVisible(!self.locationsListIsVisible());
  };
}
//Callback function called from the googleapis <script>. It initializes the app.
function initMap() {
  var options = {
    center: locations[0].position,
    zoom: 13
  };
  map = new google.maps.Map(document.getElementById('map'), options);
  // only once the map is loaded I can execute the ko.applyBindings to populate the markers array
  google.maps.event.addListenerOnce(map, 'idle', function() {
    ko.applyBindings(new locationsListViewModel());
  });
}

//Google maps loadin error-handler
//resources: https://discussions.udacity.com/t/handling-google-maps-in-async-and-fallback/34282?_ga=1.157463166.535546785.1456330839
function googleError() {
  alert('Sorry, Google Maps loading failed! Check your Internet connection and try again');
}