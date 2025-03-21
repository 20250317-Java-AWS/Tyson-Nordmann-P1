import { ActivatedRoute } from '@angular/router';
import { ExoplanetService } from '../services/exoplanet.service';
import { Component, OnInit } from '@angular/core';
import { Exoplanet } from '../models/exoplanet.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StellarDistanceService } from '../services/stellar-distance.service';

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

          this.filteredExoplanets = this.exoplanets.filter(exoplanet => 
            (exoplanet.pl_rade ?? 0) >= minRadius &&
            (exoplanet.pl_rade ?? 0) <= maxRadius &&
            (exoplanet.pl_orbper ?? 0) >= minOrbitalPeriod &&
            (exoplanet.pl_orbper ?? 0) <= maxOrbitalPeriod &&
            (exoplanet.pl_orbsmax ?? 0) >= minDistance &&
            (exoplanet.pl_orbsmax ?? 0) <= maxDistance
          );

          // Fetch stellar distances for each planet
          this.filteredExoplanets.forEach(planet => {
            if (planet.hostname) {
              this.stellarDistanceService.getDistance(planet.hostname).subscribe(distData => {
                if (Array.isArray(distData) && distData.length > 0) {
                  planet.solarDistance = distData[0].sys_dist || 'N/A';
                } 
              });
            }
          });
         // this.filteredExoplanets = this.filteredExoplanets.filter(planet => 
       //   (planet.solarDistance ?? 0) >= minStellarDistance && 
        //  (planet.solarDistance ?? 0) <= maxStellarDistance
        //  );
        } else {
          console.error("Expected an array but got:", typeof data);
        }
      });
    });
  }
}
