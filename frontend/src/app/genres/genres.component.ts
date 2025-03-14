import { Component, OnInit } from '@angular/core';
import { Genre } from '../shared/models/genre.model';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.scss'],
})
export class GenresComponent implements OnInit {
  genres: Genre[] = [];

  constructor(private movieservice: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadGenres();
  }

  loadGenres(): void {
    this.movieservice.getGenres().subscribe(
      (data) => {
        this.genres = data;
      },
      (error) => {
        console.error('Erro ao carregar gêneros:', error);
      }
    );
  }

  navigateToGenreMovies(genreName: string): void {
    this.router.navigate(['/genres-movies', genreName]);
  }
}
