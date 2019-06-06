import {AfterViewInit, Component} from '@angular/core';
import {DatabaseService, Track} from '../../services/database.service';

@Component({
  selector: 'app-trackings',
  templateUrl: 'trackings.page.html',
  styleUrls: ['trackings.page.scss'],
})
export class TrackingsPage implements AfterViewInit {

  trackings: Track[] = [];
  constructor(private db: DatabaseService) { }

  ngAfterViewInit() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getTracks().subscribe(tracks => {
          console.log(tracks);
          this.trackings = tracks;
        });
      }
    });
  }
}
