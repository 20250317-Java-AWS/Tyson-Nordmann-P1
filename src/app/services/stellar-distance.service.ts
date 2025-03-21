import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class StellarDistanceService {
  private baseUrl = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync';
  constructor(private http: HttpClient) { }

getDistance(hostname: string): Observable<any>{
  const query = `SELECT sy_dist FROM ps WHERE hostname ='${hostname}'`;
  const apiUrl = `${this.baseUrl}?query=${encodeURIComponent(query)}&format=json`;

  return this.http.get<any>(apiUrl);
}

}
