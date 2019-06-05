import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DatabaseService, Track} from "../../services/database.service";
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { Platform } from '@ionic/angular';
import { SQLite } from '@ionic-native/sqlite';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-trackings',
  templateUrl: 'trackings.page.html',
  styleUrls: ['trackings.page.scss'],
})
export class TrackingsPage implements AfterViewInit {

  trackings: Track[] = [];
  test = '';
  selectedView = 'tracks';
  constructor(private db: DatabaseService) { }

  ngAfterViewInit() {
    this.test = 'enter';
    this.db = new DatabaseService();
    this.test = 'create';
    this.db.getDatabaseState().subscribe(rdy => {
      this.test = 'not ready';
      if (rdy) {
        this.test = 'ready';
        this.db.getTracks().subscribe(tracks => {
          this.test = 'tracks';
          this.trackings = tracks;
        });
      }
    });
  }

}
