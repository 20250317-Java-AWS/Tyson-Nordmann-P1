import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Exoplanet} from '../models/exoplanet.model';

@Injectable({
  providedIn: 'root'
})

export class ExoplanetService {
  
constructor(private http: HttpClient ) { }
  
  getExoplanets(minRadius: number, maxRadius:number, minOrbitalPeriod: number, 
    maxOrbitalPeriod: number, minStarDistance: number, maxStarDistance: number,
    resultLimit: number): Observable<Exoplanet[]>{

  


let query = `SELECT TOP ${resultLimit} * FROM pscomppars WHERE 
(pl_rade BETWEEN ${minRadius} AND ${maxRadius}) AND (pl_orbper BETWEEN ${minOrbitalPeriod} AND ${maxOrbitalPeriod}) AND (pl_orbsmax BETWEEN 
${minStarDistance} AND ${maxStarDistance})`;
let apiUrl = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${encodeURIComponent(query)}&format=json`;

console.log("Generated API URL:", apiUrl);




  
    return this.http.get<Exoplanet[]>(apiUrl);
  }
}
