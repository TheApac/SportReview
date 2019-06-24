import {Component, ElementRef, ViewChild} from '@angular/core';
import leaflet from 'leaflet';
import {BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse,
  BackgroundGeolocationEvents} from '@ionic-native/background-geolocation/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild('map') mapContainer: ElementRef;
  polylines = [];
  count;
  addedPoly = false;
  map;
  start = false;
  stop = true;
  distance = 0;
  distanceDisplay = '0 m';
  prevLong = null;
  prevLat = null;
  countFunc = null;
  p = 0.017453292519943295;    // Math.PI / 180
  c = Math.cos;
  timeRun = 0;
  speed = '0 km/h';
  sport = 'Vtt';

  constructor(private backgroundGeolocation: BackgroundGeolocation, private localNotifications: LocalNotifications) {}

  startBackgroundGeolocation() {
    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 1,
      stationaryRadius: 1,
      distanceFilter: 1,
      interval: 1000,
      debug: true, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: false // enable this to clear background location settings when the app terminates
    };

    this.backgroundGeolocation.configure(config).then(() => {
      this.backgroundGeolocation
          .on(BackgroundGeolocationEvents.location)
          .subscribe((location: BackgroundGeolocationResponse) => {
            this.polylines[this.polylines.length - 1].addLatLng([location.latitude, location.longitude]);
            if (!this.stop) {
              this.addDistance(location.latitude, location.longitude);
            }
            this.prevLat = location.latitude;
            this.prevLong = location.longitude;
            // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
            // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
            // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
            this.backgroundGeolocation.finish();
          });
    }).catch((err) => {
      console.error(err);
    });
    // start recording location
    this.backgroundGeolocation.start();

  }

  ionViewDidEnter() {
    this.loadmap();
    this.startBackgroundGeolocation();
  }

  loadmap() {
    let first = true;
    this.map = leaflet.map('map').fitWorld();
    leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,' +
          ' <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
    }).addTo(this.map);
    const marker = leaflet.marker(this.map.getCenter()).addTo(this.map);
    this.addPolyline(false);
    this.map.locate({
      setView: false,
      watch: true,
      maxZoom: 10
    }).on('locationfound', (e) => {
      if (first) {
        first = false;
        this.map.setView(e.latlng, 16);
      }
      marker.setLatLng(e.latlng);
    }).on('locationerror', (err) => {
      alert(err.message);
    });
  }

  updateCount(down, sec) {
    let final;
    final = new Date();
    final.setFullYear(0, 0, 0);
    final.setHours(0);
    final.setMinutes(0);
    final.setSeconds(0);
    if (down) {
      final.setSeconds(final.getSeconds() + sec);
    }
    this.countFunc = setInterval(() => {
      if (!this.stop) {
        this.timeRun++;
        this.calcSpeed();
        if (!this.addedPoly) {
          this.addPolyline(false);
        }
        if (down) {
          final.setSeconds(final.getSeconds() - 1);
        } else {
          final.setSeconds(final.getSeconds() + 1);
        }
        this.count = (final.getHours() < 10 ? '0' : '') + final.getHours() + ':';
        this.count += (final.getMinutes() < 10 ? '0' : '') + final.getMinutes() + ':';
        this.count += (final.getSeconds() < 10 ? '0' : '') + final.getSeconds();
        if (this.count === '00:00:00') {
          clearInterval(this.countFunc);
          this.endTraining();
        }
      } else {
        if (!this.addedPoly) {
          this.addPolyline(true);
        }
      }
    }, 1000);
  }

  pause() {
    this.stop = !this.stop;
    this.addedPoly = false;
  }

  addPolyline(isPause) {
    const polyline = new leaflet.Polyline({});
    if (isPause) {
      polyline.setStyle({color: 'green', fill: 'none', dashArray: '10, 20'});
    }
    if (this.prevLat != null && this.prevLong != null) {
      polyline.addLatLng([this.prevLat, this.prevLong]);
    }
    polyline.addTo(this.map);
    this.polylines.push(polyline);
    this.addedPoly = true;
  }

  addDistance(lat2: number, long2: number) {
    if (this.prevLong != null && this.prevLat != null) {
      const a = 0.5 - this.c((this.prevLat - lat2) * this.p) / 2 +
          this.c(lat2 * this.p) * this.c((this.prevLat) * this.p) * (1 - this.c(((this.prevLong - long2) * this.p))) / 2;
      const d = this.distance + ((12742 * Math.asin(Math.sqrt(a))));
      if (d > 1) {
        this.distance = Math.floor(d * 100) / 100;
        this.distanceDisplay = this.distance + ' km';
      } else {
        this.distance = d * 1000;
        this.distance = Math.floor(d * 1000);
        this.distanceDisplay = this.distance + ' m';
      }
    }
  }

  calcSpeed() {
    const s = Math.floor(this.distance / (this.timeRun / 60 / 60) * 100) / 100;
    this.speed = s + ' km/h';
  }

  startActivity() {
    this.start = true;
    this.stop = false;
    this.updateCount(false, 0);
  }

  stopActivity() {
    clearInterval(this.countFunc);
    this.start = false;
    this.stop = true;
    this.count = '00:00:00';
  }

  endTraining() {
    this.timeRun = 4729319;
    this.localNotifications.schedule({
      id: 1,
      silent: false,
      lockscreen: true,
      title: 'Training ended',
      text: 'You ran ' + this.distanceDisplay + ' in ' + Math.floor(this.timeRun / 3600) + ' hour '
          + Math.floor((this.timeRun /  60) % 60) + ' minutes and ' + this.timeRun % 60 + ' secondes',
      vibrate: true
    });
  }
}
