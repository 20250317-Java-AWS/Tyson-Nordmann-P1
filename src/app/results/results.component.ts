import { ActivatedRoute } from '@angular/router';
import { ExoplanetService } from '../services/exoplanet.service';
import { Component, OnInit } from '@angular/core';
import { Exoplanet } from '../models/exoplanet.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StellarDistanceService } from '../services/stellar-distance.service';
import { forkJoin, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-results',
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']  
})
export class ResultsComponent implements OnInit {
  exoplanets: Exoplanet[] = [];
  filteredExoplanets: Exoplanet[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private exoplanetService: ExoplanetService,
    private stellarDistanceService: StellarDistanceService
  ) {}

  goBack(): void {
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const minRadius = params ['minRadius'] ? parseFloat(params['minRadius']) : undefined;
      const maxRadius = params ['maxRadius'] ? parseFloat(params['maxRadius']) : undefined;
      const minOrbitalPeriod = params ['minOrbitalPeriod'] ? parseFloat(params['minOrbitalPeriod']) : undefined;
      const maxOrbitalPeriod = params ['maxOrbitalPeriod'] ? parseFloat(params['maxOrbitalPeriod']) : undefined;
      const minDistance = params ['minDistance'] ? parseFloat(params['minDistance']) : undefined;
      const maxDistance = params ['maxDistance'] ? parseFloat(params['maxDistance']) : undefined;
      const minStellarDistance = params ['minStellarDistance'] ? parseFloat(params['minStellarDistance']) : undefined;
      const maxStellarDistance = params ['maxStellarDistance'] ? parseFloat(params['maxStellarDistance']) : undefined;
      const resultLimit = params['resultLimit'] ? parseInt(params['resultLimit']) : 50;
      const searchName = params['searchName'] ? params['searchName'].trim() : undefined;

      this.exoplanetService.getExoplanets(
        resultLimit,
        minRadius, maxRadius, 
        minOrbitalPeriod, maxOrbitalPeriod, 
        minDistance, maxDistance, searchName,
      
      ).subscribe(data => {
        console.log("API Response:", data); 
        if (Array.isArray(data)) {
          this.exoplanets = data;

          
          this.filteredExoplanets = this.exoplanets;
          
         
          const distanceObservables = this.filteredExoplanets.map(planet => {
            if (planet.hostname) {
             
              return this.stellarDistanceService.getDistance(planet.hostname).pipe(
                tap(distData => {
               
                  if (Array.isArray(distData) && distData.length > 0) {
                    planet.solarDistance = distData[0].sy_dist || 0;
                  } else {
                    planet.solarDistance = 0;
                  }
                })
              );
            } else {
          
              return of(null);
            }
          });

         
          forkJoin(distanceObservables).subscribe(() => {
           
        
            this.filteredExoplanets = this.filteredExoplanets.filter(planet => {
              const dist = planet.solarDistance ?? 0;
              const meetsMin = minStellarDistance !== undefined ? dist >= minStellarDistance : true;
              const meetsMax = maxStellarDistance !== undefined ? dist <= maxStellarDistance : true;
              return meetsMin && meetsMax;
            });
           
          
            console.log("Filtered by Stellar Distance:", this.filteredExoplanets);
          });
        } else {
          console.error("Expected an array but got:", typeof data);
        }
      });
    });
  }
}
