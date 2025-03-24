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
    maxOrbitalPeriod?: number, minStarDistance?: number, maxStarDistance?: number, searchName?: string,
   ): Observable<any>{
      const conditions: string[] =[];
      const cleanSearchName = searchName?.trim().replace(/'/g,"''");
      console.log('Search name:', searchName);
      console.log('Clean search name:', cleanSearchName);
      
      if(minRadius !== undefined) conditions.push(`pl_rade >= ${minRadius}`);
      if(maxRadius !== undefined) conditions.push(`pl_rade <= ${maxRadius}`);
      if ( minOrbitalPeriod !== undefined) conditions.push(`pl_orbper >= ${minOrbitalPeriod}`);
      if (maxOrbitalPeriod !== undefined) conditions.push(`pl_orbper <= ${maxOrbitalPeriod}`);
      if (minStarDistance !== undefined) conditions.push(`pl_orbsmax >= ${minStarDistance}`);
      if (maxStarDistance !== undefined) conditions.push(`pl_orbsmax <= ${maxStarDistance}`);
      if(cleanSearchName !== undefined) conditions.push(`(UPPER(hostname) LIKE UPPER('%${cleanSearchName}%') OR UPPER(pl_name) LIKE UPPER('%${cleanSearchName}%'))`);

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
