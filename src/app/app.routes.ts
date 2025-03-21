import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { ResultsComponent } from './results/results.component';

export const routes: Routes = [
    {path: '', component: SearchComponent},
    {path: 'results', component: ResultsComponent}
];
