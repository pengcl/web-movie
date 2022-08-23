import {Injectable, Pipe, PipeTransform} from '@angular/core';
import {CurrencyPipe} from '@angular/common';


@Pipe({
  name: 'isOptional',
  pure: false
})

@Injectable()
export class IsOptionalPipe implements PipeTransform {
  transform(ticketType, member): boolean {
    let result = true;
    if (ticketType.uidMemCardLevels) {
      if (!member) {
        result = false;
      } else {
        if (ticketType.uidMemCardLevels.indexOf(member.card.uidCardLevel) === -1) {
          result = false;
        }
      }
    }
    return result;
  }
}

@Pipe({
  name: 'rmb',
  pure: false
})

@Injectable()
export class RmbPipe implements PipeTransform {
  constructor(private currency: CurrencyPipe) {
  }

  transform(value): any {
    return this.currency.transform(value, 'CNY', 'symbol-narrow');
  }
}

@Pipe({
  name: 'repairDate',
  pure: false
})

@Injectable()
export class RepairDatePipe implements PipeTransform {
  transform(value): any {
    if (!value) {
      return value;
    }
    value = value.split('.')[0].replace(/\-/g, '/');
    return value;
  }
}
