import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvestmentRoutingModule } from './investment-routing.module';
import { InvestmentComponent } from './investment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormatAlertPipe } from './format-alert.pipe';
import { AlertVisibilityDirective } from './alert-visibility.directive';
import { DateFormatPipe } from './date-format.pipe';
import { CurrencyFormatPipe } from './currency-format.pipe';

@NgModule({
  declarations: [InvestmentComponent, FormatAlertPipe, AlertVisibilityDirective, DateFormatPipe, CurrencyFormatPipe],
  imports: [
    CommonModule,
    InvestmentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class InvestmentModule {}
