const googleMap = googleMap || {};

googleMap.addInfoWindowForEvent = function(event, marker, imageurl){
  google.maps.event.addListener(marker, 'click', () => {
    if (typeof this.infoWindow !== 'undefined') this.infoWindow.close();
    this.infoWindow = new google.maps.InfoWindow({
      content: `<h2><a href='https://www.meetup.com/${event.group.urlname}' target="_blank">${event.group.name}</a></h2>
      <img src='${imageurl}'>
      <h3>${event.venue.name}</h3><br>
      <p>${ event.description }</p>`
    });
    googleMap.map.setCenter(marker.getPosition());
    googleMap.map.panBy(0, -200);
    this.infoWindow.open(this.map, marker);
  });
};

googleMap.myClick = function(id){
  google.maps.event.trigger(googleMap.markers[id], 'click');
  toggleBurger();
};

googleMap.markers = [];

googleMap.createMarkerForEvent = function(event){
  let link = "";
  if (event.venue) {
    let latLng = new google.maps.LatLng(event.venue.latitude, event.venue.longitude);
    let icon = {
      url:        "images/marker.png", // url
      scaledSize: new google.maps.Size(50, 50), // scaled size
      origin:     new google.maps.Point(0,0), // origin
      anchor:     new google.maps.Point(0, 0) // anchor
    };
    let marker = new google.maps.Marker({
      position:  latLng,
      map:       this.map,
      // icon:      icon,
      animation: google.maps.Animation.DROP
    });
    this.markers.push(marker);

      $('.burger-content').append(`
        <div class='result' onclick='googleMap.myClick(${googleMap.markers.length-1})'>
        <h2><a href='${event.link}' target="_blank">${event.group.name}</a></h2>
        <img src='${event.imageurl}'>
        <h4>${event.date}</h4>
        </div>
        `);

        googleMap.addInfoWindowForEvent(event, googleMap.markers[googleMap.markers.length-1], imageurl);
    }
    };

    googleMap.loopThroughEvents = function (data){
      $.each(data.results, (index, event) => {
        window.setTimeout(()=>{
          googleMap.createMarkerForEvent(event);
        }, index*50);
      });
    };

    googleMap.getEvents = function(pos){
      $.ajax({
        url: `http://www.skiddle.com/api/v1/events/?api_key= ea9953edba78e6109c10f04d6a22971b&latitude=${pos.lat}&longitude=${pos.lng}&radius=10`,
        method: 'get',
        dataType: 'jsonp'
      }).done((this.loopThroughEvents));
    };

    googleMap.mapSetup = function(){
      setEventListeners();

      let canvas = document.getElementById('map-canvas');

      let mapOptions = {
        zoom:      14,
        center:    new google.maps.LatLng(51.506178,-0.088369),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: mapStyle,
        disableDefaultUI: true
      };
      this.map = new google.maps.Map(canvas, mapOptions);
      setOwnLocation(this.map);
    };

    function setEventListeners (){
      $('button').click(toggleBurger);
      $('.index').click(toggleBurger);
      $('.new').click(toggleBurger);
    }

    function toggleBurger() {
      $('button').toggleClass('expanded').siblings('div').slideToggle();
    }

    $(googleMap.mapSetup.bind(googleMap));

    function setOwnLocation(map){
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          let pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          let icon = {
            url:        "images/person.png", // url
            scaledSize: new google.maps.Size(50, 50), // scaled size
            origin:     new google.maps.Point(0,0), // origin
            anchor:     new google.maps.Point(0, 0) // anchor
          };

          let marker = new google.maps.Marker({
            position:  pos,
            icon,
            map:       googleMap.map,
            animation: google.maps.Animation.DROP
          });
          map.panTo(pos);
          googleMap.getEvents(pos);
        }, function() {
          handleLocationError(true, infoWindow, map.getCenter());
        });
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }


      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
          'Error: The Geolocation service failed.' :
          'Error: Your browser doesn\'t support geolocation.');
        }
      }

      const mapStyle = [{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#165c64"},{"saturation":34},{"lightness":-69},{"visibility":"on"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"hue":"#b7caaa"},{"saturation":-14},{"lightness":-18},{"visibility":"on"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"hue":"#cbdac1"},{"saturation":-6},{"lightness":-9},{"visibility":"on"}]},{"featureType":"road","elementType":"geometry","stylers":[{"hue":"#8d9b83"},{"saturation":-89},{"lightness":-12},{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"hue":"#d4dad0"},{"saturation":-88},{"lightness":54},{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"hue":"#bdc5b6"},{"saturation":-89},{"lightness":-3},{"visibility":"simplified"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"hue":"#bdc5b6"},{"saturation":-89},{"lightness":-26},{"visibility":"on"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"hue":"#c17118"},{"saturation":61},{"lightness":-45},{"visibility":"on"}]},{"featureType":"poi.park","elementType":"all","stylers":[{"hue":"#8ba975"},{"saturation":-46},{"lightness":-28},{"visibility":"on"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"hue":"#a43218"},{"saturation":74},{"lightness":-51},{"visibility":"simplified"}]},{"featureType":"administrative.province","elementType":"all","stylers":[{"hue":"#ffffff"},{"saturation":0},{"lightness":100},{"visibility":"simplified"}]},{"featureType":"administrative.neighborhood","elementType":"all","stylers":[{"hue":"#ffffff"},{"saturation":0},{"lightness":100},{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"labels","stylers":[{"hue":"#ffffff"},{"saturation":0},{"lightness":100},{"visibility":"off"}]},{"featureType":"administrative.land_parcel","elementType":"all","stylers":[{"hue":"#ffffff"},{"saturation":0},{"lightness":100},{"visibility":"off"}]},{"featureType":"administrative","elementType":"all","stylers":[{"hue":"#3a3935"},{"saturation":5},{"lightness":-57},{"visibility":"off"}]},{"featureType":"poi.medical","elementType":"geometry","stylers":[{"hue":"#cba923"},{"saturation":50},{"lightness":-46},{"visibility":"on"}]}];
