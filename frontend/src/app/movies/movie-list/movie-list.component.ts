import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
})
export class MovieListComponent implements OnInit, OnDestroy {
  movies: any[] = [];
  isFetching: boolean = false;
  page: number = 1;
  limit: number = 10;
  searchQuery: string = '';
  searchYear: string = '';
  genres: { genre: string; count: number }[] = [];
  selectOptions: { value: string; label: string }[] = [];
  selectedGenre: string = '';

  constructor(private movieService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadMovies();
    this.loadGenres();
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  }

  async loadMovies(): Promise<void> {
    if (this.isFetching) return;

    this.isFetching = true;
    try {
      const response = await lastValueFrom(
        this.movieService.getMovies(this.page, this.limit)
      );

      if (response && Array.isArray(response)) {
        for (const movie of response) {
          if (movie.links?.tmdbId) {
            try {
              const tmdbDetails = await lastValueFrom(
                this.movieService.getMovieDetails(movie.links.tmdbId)
              );
              movie.poster_path = tmdbDetails.poster_path;
              movie.tmdbOverview = tmdbDetails.overview;
              movie.tmdbRating = tmdbDetails.vote_average;
            } catch (error) {
              console.error(
                `Erro ao buscar detalhes do filme ${movie.links.tmdbId}:`,
                error
              );
            }
          }
        }
        this.movies = [...this.movies, ...response];
        this.page += 1;
      } else {
        console.error('Resposta inválida:', response);
      }
    } catch (error) {
      console.error('Erro ao carregar filmes:', error);
    } finally {
      this.isFetching = false;
    }
  }

  async searchMovies(): Promise<void> {
    if (!this.searchQuery.trim()) {
      console.log('Nenhum termo de busca fornecido.');
      return;
    }

    this.isFetching = true;
    this.movies = [];
    this.page = 1;

    try {
      const response = await lastValueFrom(
        this.movieService.searchMovies(
          this.searchQuery,
          this.searchYear,
          this.selectedGenre
        )
      );

      if (response && Array.isArray(response)) {
        for (const movie of response) {
          if (movie.links?.tmdbId) {
            try {
              const tmdbDetails = await lastValueFrom(
                this.movieService.getMovieDetails(movie.links.tmdbId)
              );
              movie.poster_path = tmdbDetails.poster_path;
              movie.tmdbOverview = tmdbDetails.overview;
              movie.tmdbRating = tmdbDetails.vote_average;
            } catch (error) {
              console.error(
                `Erro ao buscar detalhes do filme ${movie.links.tmdbId}:`,
                error
              );
            }
          }
        }
        this.movies = response;
      } else {
        console.error('Resposta inválida:', response);
      }
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
    } finally {
      this.isFetching = false;
    }
  }

  loadGenres(): void {
    this.movieService.getGenres().subscribe(
      (genres) => {
        if (genres.length > 0) {
          genres.shift();
        }

        this.genres = genres;

        this.selectOptions = genres.map((genre) => ({
          value: genre.genre,
          label: genre.genre,
        }));
      },
      (error) => {
        console.error('Erro ao carregar gêneros:', error);
      }
    );
  }

  onGenreSelected(selectedValue: string): void {
    this.selectedGenre = selectedValue;
    console.log('Gênero selecionado:', this.selectedGenre);
  }

  handleScroll(): void {
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight - 100;

    if (scrollPosition >= threshold) {
      this.loadMovies();
    }
  }
}
