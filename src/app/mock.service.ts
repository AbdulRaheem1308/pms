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
  private investment: Set<InvestmentData> = new Set();
  private selectedInvestment = new BehaviorSubject<InvestmentData | null>(null);

  private investmentDetails = new BehaviorSubject<Set<InvestmentData>>(
    this.investment
  );
  investmentData$ = this.investmentDetails.asObservable();
  selectedInvestment$ = this.selectedInvestment.asObservable();

  submitInvestment(data: InvestmentData): Observable<{ message: string }> {
    this.investment.add(data);
    this.investmentDetails.next(this.investment);
    return of({ message: 'Investment submitted successfully!' });
  }

  setSelectedInvestment(investment: InvestmentData) {
    this.selectedInvestment.next(investment);
  }

  clearSelectedInvestment() {
    this.selectedInvestment.next(null);
  }

  getAllInvestments(): Observable<Set<InvestmentData>> {
    return this.investmentData$;
  }
}
