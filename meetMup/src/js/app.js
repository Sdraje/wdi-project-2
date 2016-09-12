const App = App || {};

App.addInfoWindowForEvent = function(event, marker, imageurl){
  google.maps.event.addListener(marker, 'click', () => {
    if (typeof this.infoWindow !== 'undefined') this.infoWindow.close();
    this.infoWindow = new google.maps.InfoWindow({
      content: `<h2><a href='https://www.meetup.com/${event.group.urlname}' target="_blank">${event.group.name}</a></h2>
      <img src='${imageurl}'>
      <h3>${event.venue.name}</h3><br>
      <p>${ event.description }</p>`
    });
    App.map.setCenter(marker.getPosition());
    App.map.panBy(0, -200);
    this.infoWindow.open(this.map, marker);
  });
};

App.myClick = function(id){
  google.maps.event.trigger(App.markers[id], 'click');
  toggleBurger();
};

App.markers = [];

App.createMarkerForEvent = function(event){
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
      <div class='result' onclick='App.myClick(${App.markers.length-1})'>
      <h2><a href='${event.link}' target="_blank">${event.group.name}</a></h2>
      <img src='${event.imageurl}'>
      <h4>${event.date}</h4>
      </div>
      `);

      App.addInfoWindowForEvent(event, App.markers[App.markers.length-1], imageurl);
    }
  };

  App.loopThroughEvents = function (data){
    $.each(data.results, (index, event) => {
      window.setTimeout(()=>{
        App.createMarkerForEvent(event);
      }, index*50);
    });
  };

  App.getEvents = function(pos){
    $.ajax({
      url: `http://www.skiddle.com/api/v1/events/?api_key= ea9953edba78e6109c10f04d6a22971b&latitude=${pos.lat}&longitude=${pos.lng}&radius=10`,
      method: 'get',
      dataType: 'jsonp'
    }).done((this.loopThroughEvents));
  };

  App.clearMarkers = function(){
    for (var i = 0; i < App.markers.length; i++) {
      App.markers[i].setMap(null);
    }
    App.markers = [];
  };

  App.mapSetup = function(){
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
    App.setOwnLocation(this.map);
  };

  function setEventListeners (){
    $('button').click(toggleBurger);
    $('.index').click(toggleBurger);
    $('.new').click(toggleBurger);
    App.apiUrl = "http://localhost:3000/api";
    App.$main  = $("main");

    $(".register").on("click", App.register.bind(App));
    $(".login").on("click", App.login.bind(App));
    $(".logout").on("click", App.logout.bind(App));
    App.$main.on("submit", "form", App.handleForm);
  }

  function toggleBurger() {
    $('button').toggleClass('expanded').siblings('div').slideToggle();
  }

  $(App.mapSetup.bind(App));

  App.setOwnLocation = function(map){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        App.pos = {
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
          position:  App.pos,
          icon,
          map:       App.map,
          animation: google.maps.Animation.DROP
        });
        map.panTo(App.pos);
        if (App.getToken()) {
          App.loggedInState();
          App.getEvents(App.pos);
        } else {
          App.loggedOutState();
          App.clearMarkers();
        }

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
    };

// User authentication-----------------------------------------------

    App.loggedInState = function(){
      $(".loggedOut").hide();
      $(".loggedIn").show();
    };

    App.loggedOutState = function(){
      $(".loggedOut").show();
      $(".loggedIn").hide();
      this.register();
    };

    App.register = function() {
      if (event) event.preventDefault();
      this.$main.html(`
        <h2>Register</h2>
        <form method="post" action="/register">
        <div class="form-group">
        <input class="form-control" type="text" name="user[username]" placeholder="Username">
        </div>
        <div class="form-group">
        <input class="form-control" type="email" name="user[email]" placeholder="Email">
        </div>
        <div class="form-group">
        <input class="form-control" type="password" name="user[password]" placeholder="Password">
        </div>
        <div class="form-group">
        <input class="form-control" type="password" name="user[passwordConfirmation]" placeholder="Password Confirmation">
        </div>
        <input class="btn btn-primary" type="submit" value="Register">
        </form>
        `);
        App.getEvents(App.pos);
      };

      App.login = function() {
        event.preventDefault();
        this.$main.html(`
          <h2>Login</h2>
          <form method="post" action="/login">
          <div class="form-group">
          <input class="form-control" type="email" name="email" placeholder="Email">
          </div>
          <div class="form-group">
          <input class="form-control" type="password" name="password" placeholder="Password">
          </div>
          <input class="btn btn-primary" type="submit" value="Login">
          </form>
          `);
          App.getEvents(App.pos);
        };

        App.logout = function() {
          event.preventDefault();
          this.removeToken();
          this.loggedOutState();
          App.clearMarkers();
        };

        App.handleForm = function(){
          event.preventDefault();

          let url    = `${App.apiUrl}${$(this).attr("action")}`;
          let method = $(this).attr("method");
          let data   = $(this).serialize();

          return App.ajaxRequest(url, method, data, (data) => {
            if (data.token) App.setToken(data.token);
            App.loggedInState();
          });
        };

        App.ajaxRequest = function(url, method, data, callback){
          return $.ajax({
            url,
            method,
            data,
            beforeSend: this.setRequestHeader.bind(this)
          })
          .done(callback)
          .fail(data => {
            console.log(data);
          });
        };

        App.setRequestHeader = function(xhr, settings) {
          return xhr.setRequestHeader("Authorization", `Bearer ${this.getToken()}`);
        };

        App.setToken = function(token){
          return window.localStorage.setItem("token", token);
        };

        App.getToken = function(){
          return window.localStorage.getItem("token");
        };

        App.removeToken = function(){
          return window.localStorage.clear();
        };


        const mapStyle = [{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#165c64"},{"saturation":34},{"lightness":-69},{"visibility":"on"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"hue":"#b7caaa"},{"saturation":-14},{"lightness":-18},{"visibility":"on"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"hue":"#cbdac1"},{"saturation":-6},{"lightness":-9},{"visibility":"on"}]},{"featureType":"road","elementType":"geometry","stylers":[{"hue":"#8d9b83"},{"saturation":-89},{"lightness":-12},{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"hue":"#d4dad0"},{"saturation":-88},{"lightness":54},{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"hue":"#bdc5b6"},{"saturation":-89},{"lightness":-3},{"visibility":"simplified"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"hue":"#bdc5b6"},{"saturation":-89},{"lightness":-26},{"visibility":"on"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"hue":"#c17118"},{"saturation":61},{"lightness":-45},{"visibility":"on"}]},{"featureType":"poi.park","elementType":"all","stylers":[{"hue":"#8ba975"},{"saturation":-46},{"lightness":-28},{"visibility":"on"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"hue":"#a43218"},{"saturation":74},{"lightness":-51},{"visibility":"simplified"}]},{"featureType":"administrative.province","elementType":"all","stylers":[{"hue":"#ffffff"},{"saturation":0},{"lightness":100},{"visibility":"simplified"}]},{"featureType":"administrative.neighborhood","elementType":"all","stylers":[{"hue":"#ffffff"},{"saturation":0},{"lightness":100},{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"labels","stylers":[{"hue":"#ffffff"},{"saturation":0},{"lightness":100},{"visibility":"off"}]},{"featureType":"administrative.land_parcel","elementType":"all","stylers":[{"hue":"#ffffff"},{"saturation":0},{"lightness":100},{"visibility":"off"}]},{"featureType":"administrative","elementType":"all","stylers":[{"hue":"#3a3935"},{"saturation":5},{"lightness":-57},{"visibility":"off"}]},{"featureType":"poi.medical","elementType":"geometry","stylers":[{"hue":"#cba923"},{"saturation":50},{"lightness":-46},{"visibility":"on"}]}];
