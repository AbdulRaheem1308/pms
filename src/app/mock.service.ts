import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';

export interface InvestmentData {
  assetType: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class MockService {
  private investment: Set<InvestmentData> = new Set(); // Use InvestmentData type
  private investmentDetails = new BehaviorSubject<Set<InvestmentData>>(
    this.investment
  );
  investmentData$ = this.investmentDetails.asObservable();

  submitInvestment(data: InvestmentData): Observable<{ message: string }> {
    this.investment.add(data);
    this.investmentDetails.next(this.investment);
    return of({ message: 'Investment submitted successfully!' });
  }
}
