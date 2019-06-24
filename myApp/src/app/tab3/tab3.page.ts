import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  showTime = false;
  showDistance = false;

  constructor() {}

  selectTime(value) {
    console.log(value.detail.value);
    if (value.detail.value === 'time') {
      this.showTime = true;
      this.showDistance = false;
    } else if (value.detail.value === 'distance') {
      this.showTime = false;
      this.showDistance = true;
    }
  }

}
