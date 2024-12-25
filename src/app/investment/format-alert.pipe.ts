import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatAlert',
})
export class FormatAlertPipe implements PipeTransform {
  transform(success: boolean): string {
    return success
      ? 'Investment successfully added!'
      : 'Something went wrong, please try again.';
  }
}
