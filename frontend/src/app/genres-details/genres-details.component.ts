import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-genres-details',
  templateUrl: './genres-details.component.html',
  styleUrls: ['./genres-details.component.scss'],
})
export class GenresDetailsComponent implements OnInit {
  movies: any[] = [];
  genreName: string | null = null;
  page: number = 1;
  limit: number = 10;
  isFetching: boolean = false;
  searchQuery: string = '';
  searchYear: string = '';
  genres: { genre: string; count: number }[] = [];
  selectOptions: { value: string; label: string }[] = [];
  selectedGenre: string = '';

  constructor(
    private route: ActivatedRoute,
    private movieService: ApiService
  ) {}

  ngOnInit(): void {
    this.genreName = this.route.snapshot.paramMap.get('genreName');

    if (this.genreName) {
      this.loadMoviesByGenre(this.genreName);
    }
  }

  async loadMoviesByGenre(genreName: string): Promise<void> {
    if (this.isFetching) return;

    this.isFetching = true;
    try {
      const response = await lastValueFrom(
        this.movieService.getMoviesByGenres(genreName, this.limit, this.page)
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
}
