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
  styleUrls: ['./results.component.css']  // Fixed: styleUrls (plural)
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
      const minRadius = parseFloat(params['minRadius']) || 0;
      const maxRadius = parseFloat(params['maxRadius']) || 0;
      const minOrbitalPeriod = parseFloat(params['minOrbitalPeriod']) || 0;
      const maxOrbitalPeriod = parseFloat(params['maxOrbitalPeriod']) || 0;
      const minDistance = parseFloat(params['minDistance']) || 0;
      const maxDistance = parseFloat(params['maxDistance']) || 15;
      const minStellarDistance = parseFloat(params['minStellarDistance']) || 0;
      const maxStellarDistance = parseFloat(params['maxStellarDistance']) || 50000;

      this.exoplanetService.getExoplanets(
        minRadius, maxRadius, 
        minOrbitalPeriod, maxOrbitalPeriod, 
        minDistance, maxDistance, 
        50
      ).subscribe(data => {
        console.log("API Response:", data); 
        if (Array.isArray(data)) {
          this.exoplanets = data;

          // Assign the filtered list to all exoplanets initially.
          this.filteredExoplanets = this.exoplanets;
          
          // Build an array of observables to fetch stellar distances for each planet.
          const distanceObservables = this.filteredExoplanets.map(planet => {
            if (planet.hostname) {
              // Return an observable that updates the planet's solarDistance.
              return this.stellarDistanceService.getDistance(planet.hostname).pipe(
                tap(distData => {
                  // Fixed: Removed extra parenthesis in the if statement.
                  if (Array.isArray(distData) && distData.length > 0) {
                    planet.solarDistance = distData[0].sy_dist || 0;
                  } else {
                    planet.solarDistance = 0;
                  }
                })
              );
            } else {
              // If there's no hostname, return an observable that completes.
              return of(null);
            }
          });

          // Use forkJoin to wait until all distance observables complete.
          forkJoin(distanceObservables).subscribe(() => {
            // Now filter by stellar distance (which is in parsecs).
            this.filteredExoplanets = this.filteredExoplanets.filter(planet => 
              (planet.solarDistance ?? 0) >= minStellarDistance && 
              (planet.solarDistance ?? 0) <= maxStellarDistance
            );
            console.log("Filtered by Stellar Distance:", this.filteredExoplanets);
          });
        } else {
          console.error("Expected an array but got:", typeof data);
        }
      });
    });
  }
}
