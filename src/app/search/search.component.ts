import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  
  selector: 'app-search',
  imports: [CommonModule,FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  minRadius?: number;
  maxRadius?: number;
  minOrbitalPeriod?: number;
  maxOrbitalPeriod?: number;
  minStarDistance?: number;
  maxStarDistance?: number;
  minStellarDistance?: number;
  maxStellarDistance?: number;
  searchName?: string;
  resultLimit: number = 50;

  constructor(private router: Router) {}

  search() {
    console.log("Search Name:", this.searchName);
    this.router.navigate(['/results'], {
     
      queryParams: {
        minRadius: this.minRadius,
        maxRadius: this.maxRadius,
        minOrbitalPeriod: this.minOrbitalPeriod,
        maxOrbitalPeriod: this.maxOrbitalPeriod,
        minStarDistance: this.minStarDistance,
        maxStarDistance: this.maxStarDistance,
        minStellarDistance: this.minStarDistance,
        maxStellarDistance: this.maxStellarDistance,
        searchName: this.searchName,
        resultLimit: this.resultLimit
      }
    });
  }
  }


