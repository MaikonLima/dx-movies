import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoviesComponent } from './movies.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [MoviesComponent, MovieListComponent, MovieDetailComponent],
  imports: [CommonModule, RouterModule],
})
export class MoviesModule {}
