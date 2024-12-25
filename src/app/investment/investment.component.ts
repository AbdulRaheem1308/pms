import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { InvestmentData, MockService } from '../mock.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-investment',
  templateUrl: './investment.component.html',
  styleUrls: ['./investment.component.css'],
})
export class InvestmentComponent {
  investmentForm: FormGroup;
  showDashboardLink: boolean = false;
  showMessage: boolean = false;
  success: boolean = false;
  showForm: boolean = true;
  submittedInvestment!: InvestmentData;

  constructor(private router: Router, private mockService: MockService) {
    this.investmentForm = new FormGroup({
      assetType: new FormControl('', Validators.required),
      quantity: new FormControl('', [Validators.required, Validators.min(1)]),
      purchasePrice: new FormControl('', [
        Validators.required,
        Validators.min(0.01),
      ]),
      purchaseDate: new FormControl('', [
        Validators.required,
        this.dateValidator,
      ]),
    });
  }

  onSubmit(): void {
    this.showDashboardLink = false;
    if (this.investmentForm.valid) {
      this.submittedInvestment = this.investmentForm.value;
      this.showMessage = true;
      this.mockService
        .submitInvestment(this.investmentForm.value)
        .subscribe(() => {
          this.success = true;
          this.showDashboardLink = true;
          this.showForm = false;
        });
    } else {
      this.success = false;
    }
    this.investmentForm.reset();
  }

  loadDashboard(): void {
    this.router.navigate(['dashboard']);
  }

  closeAlert(): void {
    this.showMessage = false;
  }

  private dateValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const today = new Date();
    const selectedDate = new Date(control.value);
    return selectedDate > today ? { futureDate: true } : null;
  }

  showFormHandle() {
    this.submittedInvestment = {
      assetType: '',
      quantity: 0,
      purchasePrice: 0,
      purchaseDate: '',
    };
    this.showForm = true;
  }
}
