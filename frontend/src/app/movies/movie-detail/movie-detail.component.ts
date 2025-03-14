import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss'],
})
export class MovieDetailComponent implements OnInit {
  movie: any = {};
  isLoading: boolean = true;
  isFavorite: boolean = false;
  showTrailerModal: boolean = false;
  trailerUrl: string = '';
  id: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: ApiService
  ) {}

  async ngOnInit(): Promise<void> {
    this.id = this.route.snapshot.paramMap.get('id');
    const type = this.route.snapshot.paramMap.get('type');

    if (!this.id || !type) {
      console.log('ID ou tipo inválido!');
      this.router.navigate(['/']);
      return;
    }

    try {
      if (type === 'movies' || type === 'movie') {
        this.movie = await lastValueFrom(
          this.movieService.getMovieById(+this.id)
        );
      } else if (type === 'series' || type === 'tv') {
        this.movie = await lastValueFrom(
          this.movieService.getSeriesById(+this.id)
        );
      } else {
        throw new Error('Tipo desconhecido');
      }

      this.isLoading = false;
      this.checkIfFavorite();
    } catch (error) {
      console.log('Erro ao carregar detalhes do filme ou série!');
      this.isLoading = false;
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
    }
  }

  getYearFromDate(dateString: string): number {
    const date = new Date(dateString);
    return date.getFullYear();
  }

  toggleFavorite(): void {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const index = favorites.findIndex((fav: any) => fav.id === this.movie.id);

    if (index === -1) {
      favorites.push(this.movie);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      this.isFavorite = true;
      console.log('Adicionado aos favoritos!');
    } else {
      favorites.splice(index, 1);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      this.isFavorite = false;
      console.log('Removido dos favoritos!');
    }
  }

  checkIfFavorite(): void {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    this.isFavorite = favorites.some((fav: any) => fav.id === this.movie.id);
  }

  async fetchTrailer(): Promise<void> {
    try {
      const response = await lastValueFrom(
        this.movieService.getMovieTrailer(+this.id!)
      );
      this.trailerUrl = `https://www.youtube.com/embed/${response.results[0].key}`;
    } catch (error) {
      console.error('Erro ao carregar o trailer:', error);
    }
  }

  closeModal(): void {
    this.showTrailerModal = false;
    this.trailerUrl = '';
  }
}
