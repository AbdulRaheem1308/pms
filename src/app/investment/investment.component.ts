import { Component, OnInit } from '@angular/core';
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
export class InvestmentComponent implements OnInit {
  investmentForm: FormGroup;
  showDashboardLink: boolean = false;
  showMessage: boolean = false;
  success: boolean = false;
  showForm: boolean = true;
  submittedInvestment!: InvestmentData;

  constructor(private router: Router, private mockService: MockService) {
    this.investmentForm = new FormGroup({
      assetType: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]),
      quantity: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.pattern('^[0-9]*'),
      ]),
      purchasePrice: new FormControl('', [
        Validators.required,
        Validators.min(0.01),
        Validators.pattern('^[0-9]*.?[0-9]+'),
      ]),
      purchaseDate: new FormControl('', [
        Validators.required,
        this.dateValidator,
      ]),
    });
  }

  ngOnInit() {
    this.mockService.selectedInvestment$.subscribe((investment) => {
      if (investment) {
        const formattedDate = investment.purchaseDate
          ? new Date(investment.purchaseDate).toISOString().split('T')[0]
          : '';

        this.investmentForm.patchValue({
          assetType: investment.assetType,
          quantity: investment.quantity,
          purchasePrice: investment.purchasePrice,
          purchaseDate: formattedDate,
        });
      }
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
      this.markFormGroupTouched(this.investmentForm);
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

  getErrorMessage(controlName: string): string {
    const control = this.investmentForm.get(controlName);
    if (control?.errors) {
      if (control.errors['required']) {
        return `${controlName} is required`;
      }
      if (control.errors['minlength']) {
        return `${controlName} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
      if (control.errors['maxlength']) {
        return `${controlName} cannot exceed ${control.errors['maxlength'].requiredLength} characters`;
      }
      if (control.errors['min']) {
        return `${controlName} must be at least ${control.errors['min'].min}`;
      }
      if (control.errors['pattern']) {
        if (controlName === 'quantity') {
          return 'Please enter a valid number';
        }
        if (controlName === 'purchasePrice') {
          return 'Please enter a valid price';
        }
      }
      if (control.errors['futureDate']) {
        return 'Purchase date cannot be in the future';
      }
    }
    return '';
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.investmentForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
}
