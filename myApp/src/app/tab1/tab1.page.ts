import {Component, ElementRef, ViewChild} from '@angular/core';
import leaflet from 'leaflet';
import {BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse, BackgroundGeolocationEvents} from '@ionic-native/background-geolocation/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild('map') mapContainer: ElementRef;
  constructor(private backgroundGeolocation: BackgroundGeolocation) {
  }

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
            // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
            // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
            // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
          });
    }).catch((err) => {
      console.error(err);
    });
    // start recording location
    this.backgroundGeolocation.start();

  }

  ionViewDidEnter() {
    this.loadmap();
  }

  loadmap() {
    const map = leaflet.map('map').fitWorld();
    leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
    }).addTo(map);
    const marker = leaflet.marker(map.getCenter()).addTo(map);
    map.locate({
      setView: true,
      watch: true,
      maxZoom: 10
    }).on('locationfound', (e) => {
      marker.setLatLng(e.latlng);
      map.setView(marker.getLatLng(), 10);
    }).on('locationerror', (err) => {
      alert(err.message);
    });
  }

}
