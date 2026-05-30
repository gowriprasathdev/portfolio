import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PortfolioData } from '../models/portfolio-data.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioDataService {
  private http = inject(HttpClient);

  // JSON is located in the public assets folder, which is served from the root
  private dataUrl = 'data/portfolio-data.json';

  getPortfolioData(): Observable<PortfolioData> {
    return this.http.get<PortfolioData>(this.dataUrl);
  }
}
