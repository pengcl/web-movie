import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-seat',
  templateUrl: 'seat.html',
  styleUrls: ['seat.scss']
})
export class SeatComponent implements OnChanges {
  @Input() seat: any;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.seat && changes.seat.currentValue && changes.seat.currentValue !== changes.seat.previousValue) {
    }
  }

}
