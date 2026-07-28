/* ===== GEOLOCATION — Westbridge School ===== */

var GeoApp = (function () {

  /* ── School coordinates (Main Road, Lahore) ── */
  var SCHOOL = {
    lat: 31.5204,
    lng: 74.3587,
    name: 'Westbridge Junior & Upper School',
    address: 'Main Road, Lahore, Punjab, Pakistan',
    phone: '+92 300 1234567'
  };

  var map = null;
  var userMarker = null;
  var schoolMarker = null;
  var routeLine = null;
  var userPosition = null;

  /* ── Check if Leaflet is loaded ── */
  function hasLeaflet() {
    return typeof L !== 'undefined';
  }

  /* ── Check if browser supports geolocation ── */
  function hasGeolocation() {
    return 'geolocation' in navigator;
  }

  /* ══════════════════════════════════════════════
     MAP INITIALIZATION
  ══════════════════════════════════════════════ */

  function initMap(containerId, options) {
    if (!hasLeaflet()) {
      console.warn('Leaflet not loaded');
      return null;
    }

    var opts = options || {};
    var zoom = opts.zoom || 15;
    var scrollWheel = opts.scrollWheel !== undefined ? opts.scrollWheel : true;

    var container = document.getElementById(containerId);
    if (!container) return null;

    /* Create map */
    map = L.map(containerId, {
      center: [SCHOOL.lat, SCHOOL.lng],
      zoom: zoom,
      scrollWheelZoom: scrollWheel,
      zoomControl: true
    });

    /* Dark/light tile layer */
    var isDark = document.body.classList.contains('dark-mode');
    var tileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

    var tileLayer = L.tileLayer(tileUrl, { attribution: attribution, maxZoom: 19 });
    tileLayer.addTo(map);

    /* Custom school icon */
    var schoolIcon = L.divIcon({
      className: 'geo-custom-marker',
      html: '<div class="geo-marker-school"><i class="fas fa-school"></i></div>',
      iconSize: [44, 44],
      iconAnchor: [22, 44],
      popupAnchor: [0, -48]
    });

    /* School marker */
    schoolMarker = L.marker([SCHOOL.lat, SCHOOL.lng], { icon: schoolIcon }).addTo(map);
    schoolMarker.bindPopup(
      '<div class="geo-popup">' +
        '<strong>' + SCHOOL.name + '</strong><br>' +
        '<small>' + SCHOOL.address + '</small><br>' +
        '<a href="https://www.google.com/maps/dir/?api=1&destination=' + SCHOOL.lat + ',' + SCHOOL.lng + '" target="_blank" class="geo-popup-link">' +
          '<i class="fas fa-directions"></i> Get Directions' +
        '</a>' +
      '</div>'
    );

    /* Store tile layer for theme switching */
    map._tileLayer = tileLayer;

    return map;
  }

  /* ══════════════════════════════════════════════
     USER LOCATION TRACKING
  ══════════════════════════════════════════════ */

  function getUserLocation(onSuccess, onError) {
    if (!hasGeolocation()) {
      if (onError) onError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      function (position) {
        userPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        if (onSuccess) onSuccess(userPosition);
      },
      function (error) {
        var msg = '';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = 'Location permission denied. Please allow location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            msg = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            msg = 'Location request timed out.';
            break;
          default:
            msg = 'An unknown error occurred.';
        }
        if (onError) onError(msg);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 300000 }
    );
  }

  function watchUserLocation(onUpdate, onError) {
    if (!hasGeolocation()) return null;

    return navigator.geolocation.watchPosition(
      function (position) {
        userPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        if (onUpdate) onUpdate(userPosition);
      },
      function (error) {
        if (onError) onError(error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  /* ══════════════════════════════════════════════
     SHOW USER ON MAP
  ══════════════════════════════════════════════ */

  function showUserOnMap(pos) {
    if (!map) return;

    var userIcon = L.divIcon({
      className: 'geo-custom-marker',
      html: '<div class="geo-marker-user"><i class="fas fa-user"></i></div>',
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -40]
    });

    if (userMarker) {
      userMarker.setLatLng([pos.lat, pos.lng]);
    } else {
      userMarker = L.marker([pos.lat, pos.lng], { icon: userIcon }).addTo(map);
      userMarker.bindPopup('<strong>You are here</strong>');
    }

    /* Accuracy circle */
    if (userMarker._accuracyCircle) {
      map.removeLayer(userMarker._accuracyCircle);
    }
    var accuracyCircle = L.circle([pos.lat, pos.lng], {
      radius: pos.accuracy || 100,
      color: '#3b82f6',
      fillColor: '#3b82f6',
      fillOpacity: 0.08,
      weight: 1
    }).addTo(map);
    userMarker._accuracyCircle = accuracyCircle;

    /* Draw line from user to school */
    if (routeLine) map.removeLayer(routeLine);
    routeLine = L.polyline(
      [[pos.lat, pos.lng], [SCHOOL.lat, SCHOOL.lng]],
      { color: '#d4a017', weight: 3, dashArray: '8, 8', opacity: 0.8 }
    ).addTo(map);

    /* Fit bounds to show both markers */
    var bounds = L.latLngBounds(
      [[pos.lat, pos.lng], [SCHOOL.lat, SCHOOL.lng]]
    );
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
  }

  /* ══════════════════════════════════════════════
     DISTANCE CALCULATION (Haversine)
  ══════════════════════════════════════════════ */

  function toRad(deg) {
    return deg * (Math.PI / 180);
  }

  function calculateDistance(lat1, lng1, lat2, lng2) {
    var R = 6371; /* Earth radius in km */
    var dLat = toRad(lat2 - lat1);
    var dLng = toRad(lng2 - lng1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function getDistanceFromSchool(pos) {
    return calculateDistance(pos.lat, pos.lng, SCHOOL.lat, SCHOOL.lng);
  }

  function formatDistance(km) {
    if (km < 1) {
      return Math.round(km * 1000) + ' m';
    }
    return km.toFixed(1) + ' km';
  }

  function getEstimatedTime(km) {
    /* Rough estimate: 30 km/h average city speed */
    var hours = km / 30;
    var mins = Math.round(hours * 60);
    if (mins < 60) return mins + ' min';
    var h = Math.floor(mins / 60);
    var m = mins % 60;
    return h + 'h ' + m + 'm';
  }

  /* ══════════════════════════════════════════════
     DISTANCE CARD UI
  ══════════════════════════════════════════════ */

  function updateDistanceCard(pos) {
    var dist = getDistanceFromSchool(pos);
    var distText = formatDistance(dist);
    var timeText = getEstimatedTime(dist);

    var card = document.getElementById('geoDistanceCard');
    if (!card) return;

    card.style.display = '';

    var distEl = card.querySelector('.geo-dist-value');
    var timeEl = card.querySelector('.geo-dist-time');
    var coordEl = card.querySelector('.geo-dist-coords');

    if (distEl) distEl.textContent = distText;
    if (timeEl) timeEl.textContent = '~' + timeText + ' drive';
    if (coordEl) coordEl.textContent = pos.lat.toFixed(4) + ', ' + pos.lng.toFixed(4);
  }

  /* ══════════════════════════════════════════════
     DIRECTIONS
  ══════════════════════════════════════════════ */

  function getGoogleMapsUrl(from) {
    var url = 'https://www.google.com/maps/dir/?api=1';
    url += '&destination=' + SCHOOL.lat + ',' + SCHOOL.lng;
    if (from) {
      url += '&origin=' + from.lat + ',' + from.lng;
    }
    url += '&travelmode=driving';
    return url;
  }

  function openDirections() {
    if (userPosition) {
      window.open(getGoogleMapsUrl(userPosition), '_blank');
    } else {
      window.open(getGoogleMapsUrl(), '_blank');
    }
  }

  /* ══════════════════════════════════════════════
     NEARBY LANDMARKS
  ══════════════════════════════════════════════ */

  function addNearbyLandmarks() {
    if (!map) return;

    var landmarks = [
      { name: 'Lahore Railway Station', lat: 31.5493, lng: 74.3436, icon: 'fa-train', color: '#ef4444' },
      { name: 'Badshahi Mosque', lat: 31.5883, lng: 74.3167, icon: 'fa-mosque', color: '#8b5cf6' },
      { name: 'Lahore Fort', lat: 31.5878, lng: 74.3209, icon: 'fa-landmark', color: '#f59e0b' },
      { name: 'Minar-e-Pakistan', lat: 31.5117, lng: 74.3167, icon: 'fa-monument', color: '#10b981' },
      { name: 'Aitchison College', lat: 31.5167, lng: 74.3417, icon: 'fa-graduation-cap', color: '#3b82f6' }
    ];

    landmarks.forEach(function (lm) {
      var icon = L.divIcon({
        className: 'geo-custom-marker',
        html: '<div class="geo-marker-landmark" style="background:' + lm.color + '"><i class="fas ' + lm.icon + '"></i></div>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -34]
      });

      L.marker([lm.lat, lm.lng], { icon: icon }).addTo(map)
        .bindPopup('<strong>' + lm.name + '</strong><br><small>' + formatDistance(calculateDistance(lm.lat, lm.lng, SCHOOL.lat, SCHOOL.lng)) + ' from school</small>');
    });
  }

  /* ══════════════════════════════════════════════
     THEME SWITCHING
  ══════════════════════════════════════════════ */

  function switchMapTheme() {
    if (!map || !map._tileLayer) return;

    var isDark = document.body.classList.contains('dark-mode');
    map.removeLayer(map._tileLayer);

    var tileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}{r}.png';
    var attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

    map._tileLayer = L.tileLayer(tileUrl, { attribution: attribution, maxZoom: 19 });
    map._tileLayer.addTo(map);
  }

  /* ══════════════════════════════════════════════
     CONTACT PAGE INIT
  ══════════════════════════════════════════════ */

  function initContactPage() {
    if (!hasLeaflet()) return;

    /* Initialize map */
    initMap('geoMap', { zoom: 15, scrollWheel: false });

    /* Add landmarks */
    addNearbyLandmarks();

    /* Distance button */
    var distBtn = document.getElementById('geoLocateBtn');
    if (distBtn) {
      distBtn.addEventListener('click', function () {
        distBtn.disabled = true;
        distBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Locating...';

        getUserLocation(
          function (pos) {
            distBtn.disabled = false;
            distBtn.innerHTML = '<i class="fas fa-crosshairs"></i> Find My Distance';
            showUserOnMap(pos);
            updateDistanceCard(pos);
            showToast('Location found! Distance calculated.', 'success');
          },
          function (err) {
            distBtn.disabled = false;
            distBtn.innerHTML = '<i class="fas fa-crosshairs"></i> Find My Distance';
            showToast(err, 'warning');
          }
        );
      });
    }

    /* Directions button */
    var dirBtn = document.getElementById('geoDirectionsBtn');
    if (dirBtn) {
      dirBtn.addEventListener('click', openDirections);
    }

    /* Theme toggle re-render */
    var themeToggle = document.getElementById('themeToggle');
    var darkToggle = document.getElementById('darkToggle');
    function onTheme() {
      setTimeout(switchMapTheme, 100);
    }
    if (themeToggle) themeToggle.addEventListener('click', onTheme);
    if (darkToggle) darkToggle.addEventListener('click', onTheme);
  }

  /* ══════════════════════════════════════════════
     HOMEPAGE INIT (small map in contact section)
  ══════════════════════════════════════════════ */

  function initHomePage() {
    if (!hasLeaflet()) return;

    initMap('homeGeoMap', { zoom: 14, scrollWheel: false });

    /* Directions only on homepage */
    var dirBtn = document.getElementById('homeDirectionsBtn');
    if (dirBtn) {
      dirBtn.addEventListener('click', openDirections);
    }

    /* Theme toggle */
    var themeToggle = document.getElementById('themeToggle');
    var darkToggle = document.getElementById('darkToggle');
    function onTheme() {
      setTimeout(switchMapTheme, 100);
    }
    if (themeToggle) themeToggle.addEventListener('click', onTheme);
    if (darkToggle) darkToggle.addEventListener('click', onTheme);
  }

  /* ══════════════════════════════════════════════
     PUBLIC API
  ══════════════════════════════════════════════ */

  return {
    initMap: initMap,
    initContactPage: initContactPage,
    initHomePage: initHomePage,
    getUserLocation: getUserLocation,
    calculateDistance: calculateDistance,
    formatDistance: formatDistance,
    openDirections: openDirections,
    switchMapTheme: switchMapTheme,
    SCHOOL: SCHOOL
  };

})();

/* ── Auto-init on DOMContentLoaded ── */
document.addEventListener('DOMContentLoaded', function () {
  /* Contact page */
  if (document.getElementById('geoMap')) {
    GeoApp.initContactPage();
  }
  /* Homepage */
  if (document.getElementById('homeGeoMap')) {
    GeoApp.initHomePage();
  }
});
