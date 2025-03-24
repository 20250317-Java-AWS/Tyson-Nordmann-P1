import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Exoplanet} from '../models/exoplanet.model';

@Injectable({
  providedIn: 'root'
})

export class ExoplanetService {
  
constructor(private http: HttpClient ) { }
  
  getExoplanets(  resultLimit: number, minRadius?: number, maxRadius?:number, minOrbitalPeriod?: number, 
    maxOrbitalPeriod?: number, minStarDistance?: number, maxStarDistance?: number,
   ): Observable<any>{
      const conditions: string[] =[];

      if(minRadius !== undefined) conditions.push(`pl_rade >= ${minRadius}`);
      if(maxRadius !== undefined) conditions.push(`pl_rade <= ${maxRadius}`);
      if ( minOrbitalPeriod !== undefined) conditions.push(`pl_orbper >= ${minOrbitalPeriod}`);
      if (maxOrbitalPeriod !== undefined) conditions.push(`pl_orbper <= ${maxOrbitalPeriod}`);
      if (minStarDistance !== undefined) conditions.push(`pl_orbsmax >= ${minStarDistance}`);
      if (maxStarDistance !== undefined) conditions.push(`pl_orbsmax <= ${maxStarDistance}`);

      const whereClause = conditions.length ?`WHERE ${conditions.join(' AND ')}` : '';
      const query = `SELECT TOP ${resultLimit} * FROM pscomppars ${whereClause}`;
      const apiUrl = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${encodeURIComponent(query)}&format=json`;

  


//let query = `SELECT TOP ${resultLimit} * FROM pscomppars WHERE 
//(pl_rade BETWEEN ${minRadius} AND ${maxRadius}) AND (pl_orbper BETWEEN ${minOrbitalPeriod} AND ${maxOrbitalPeriod}) AND (pl_orbsmax BETWEEN 
//${minStarDistance} AND ${maxStarDistance})`;
//let apiUrl = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${encodeURIComponent(query)}&format=json`;

console.log("Generated API URL:", apiUrl);




  
    return this.http.get<Exoplanet[]>(apiUrl);
  }
}
