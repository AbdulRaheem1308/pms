import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number): string {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  }
}
