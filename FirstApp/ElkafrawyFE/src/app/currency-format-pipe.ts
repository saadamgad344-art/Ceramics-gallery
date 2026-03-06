import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
})
export class CurrencyFormatPipe implements PipeTransform {

  transform(value: number, currency: string = ' EGP'): String {
    return `${value.toFixed(2)} ${currency}`;
  }

}
