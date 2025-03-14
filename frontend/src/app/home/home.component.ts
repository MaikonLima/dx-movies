import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ApiService } from '../services/api.service';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private movieService: ApiService) {}

  moviesTop: any[] = [];
  moviesPopular: any[] = [];
  sliderMovies: any[] = [];
  isFetching: boolean = false;
  limit: number = 10;

  carouselOptions: OwlOptions = {
    loop: true,
    margin: 10,
    nav: true,
    dots: false,
    autoplay: false,
    autoplayTimeout: 2000,
    autoplayHoverPause: false,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    navText: [
      '<img src="../../../assets/arrow-left.svg" class="w-6 h-6">',
      '<img src="../../../assets/arrow-right.svg" class="w-6 h-6">',
    ],
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 3,
      },
      1000: {
        items: 5,
      },
    },
  };

  mainCarouselOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: false,
    margin: 10,
    autoWidth: true,
    items: 1,
    dots: false,
    nav: false,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
  };

  ngOnInit(): void {
    this.loadMoviesTop();
    this.loadMoviesPopular();
  }

  async loadMoviesTop(): Promise<void> {
    this.isFetching = true;
    try {
      const response = await lastValueFrom(this.movieService.getMoviesTop());

      if (response && Array.isArray(response)) {
        console.log('Filmes recebidos:', response);

        for (const movietop of response) {
          if (movietop.links?.tmdbId) {
            try {
              console.log(
                `Buscando detalhes do TMDB para o filme ${movietop.links.tmdbId}...`
              );
              const tmdbDetails = await lastValueFrom(
                this.movieService.getMovieDetails(movietop.links.tmdbId)
              );

              movietop.poster_path = tmdbDetails.poster_path;
              movietop.tmdbOverview = tmdbDetails.overview;
              movietop.tmdbRating = tmdbDetails.vote_average;
            } catch (error) {
              console.error(
                `Erro ao buscar detalhes do filme ${movietop.links.tmdbId}:`,
                error
              );
            }
          }
        }

        this.moviesTop = [...this.moviesTop, ...response];
      } else {
        console.error('Resposta inválida:', response);
      }
    } catch (error) {
      console.error('Erro ao carregar os filmes:', error);
    } finally {
      this.isFetching = false;
      console.log('Busca concluída.');
    }
  }

  async loadMoviesPopular(): Promise<void> {
    this.isFetching = true;
    try {
      const response = await lastValueFrom(
        this.movieService.getMoviesPopular()
      );

      if (response && Array.isArray(response)) {
        console.log('Filmes recebidos:', response);

        for (const movietop of response) {
          if (movietop.links?.tmdbId) {
            try {
              console.log(
                `Buscando detalhes do TMDB para o filme ${movietop.links.tmdbId}...`
              );
              const tmdbDetails = await lastValueFrom(
                this.movieService.getMovieDetails(movietop.links.tmdbId)
              );

              movietop.poster_path = tmdbDetails.poster_path;
              movietop.tmdbOverview = tmdbDetails.overview;
              movietop.tmdbRating = tmdbDetails.vote_average;
              console.log(
                `Detalhes do TMDB atualizados para o filme ${movietop.links.tmdbId}.`
              );
            } catch (error) {
              console.error(
                `Erro ao buscar detalhes do filme ${movietop.links.tmdbId}:`,
                error
              );
            }
          }
        }

        this.moviesPopular = [...this.moviesPopular, ...response];
      } else {
        console.error('Resposta inválida:', response);
      }
    } catch (error) {
      console.error('Erro ao carregar os filmes:', error);
    } finally {
      this.isFetching = false;
      console.log('Busca concluída.');
    }
  }

  getYearFromDate(date: string): string {
    return date ? new Date(date).getFullYear().toString() : '';
  }
}
