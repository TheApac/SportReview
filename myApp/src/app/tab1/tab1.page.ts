import {Component, ElementRef, ViewChild} from '@angular/core';
import leaflet from 'leaflet';
import {BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse,
  BackgroundGeolocationEvents} from '@ionic-native/background-geolocation/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild('map') mapContainer: ElementRef;
  firstpolyline = new leaflet.Polyline({});
  polylines = [];
  count;
  addedPoly = false;
  map;
  stop = false;

  constructor(private backgroundGeolocation: BackgroundGeolocation) {}

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
            if (!this.stop) {
              this.polylines[this.polylines.length - 1].addLatLng([location.latitude, location.longitude]);
            }
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
    this.updateCount(false, 0);
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
    this.firstpolyline.addTo(this.map);
    this.polylines.push(this.firstpolyline);
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
    const count = setInterval(() => {
      if (!this.stop) {
        this.addedPoly = false;
        if (down) {
          final.setSeconds(final.getSeconds() - 1);
        } else {
          final.setSeconds(final.getSeconds() + 1);
        }
        this.count = (final.getHours() < 10 ? '0' : '') + final.getHours() + ':';
        this.count += (final.getMinutes() < 10 ? '0' : '') + final.getMinutes() + ':';
        this.count += (final.getSeconds() < 10 ? '0' : '') + final.getSeconds();
        if (this.count === '00:00:00') {
          clearInterval(count);
        }
      } else {
        if (!this.addedPoly) {
          const polyline = new leaflet.Polyline({});
          polyline.addTo(this.map);
          this.polylines.push(polyline);
          this.addedPoly = true;
        }
      }
    }, 1000);
  }

  pause() {
    this.stop = !this.stop;
  }
}
