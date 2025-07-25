import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';
  private tmdbApiUrl = 'https://api.themoviedb.org/3';
  private apiKey = '_sua_chave_api';

  constructor(private http: HttpClient) {}

  getMovies(page: number, limit: number): Observable<any[]> {
    const url = `${this.apiUrl}/movies?page=${page}&limit=${limit}`;
    return this.http
      .get<any>(url)
      .pipe(map((response) => response.movies || []));
  }

  getMovieDetails(movieId: number): Observable<any> {
    const url = `${this.tmdbApiUrl}/movie/${movieId}?api_key=${this.apiKey}`;
    return this.http.get<any>(url);
  }

  getMovieById(movieId: number): Observable<any> {
    const url = `${this.tmdbApiUrl}/movie/${movieId}?api_key=${this.apiKey}`;
    return this.http.get<any>(url);
  }

  getSeriesById(seriesId: number): Observable<any> {
    const url = `${this.tmdbApiUrl}/tv/${seriesId}?api_key=${this.apiKey}`;
    return this.http.get<any>(url);
  }

  getMovieTrailer(movieId: number): Observable<any> {
    const url = `${this.tmdbApiUrl}/movie/${movieId}/videos?api_key=${this.apiKey}`;
    return this.http.get<any>(url);
  }

  getGenres(): Observable<{ genre: string; count: number }[]> {
    return this.http
      .get<{ genre: string; count: number }[]>(`${this.apiUrl}/stats/genres`)
      .pipe(
        map((genres) => {
          if (genres.length > 0) {
            genres.shift();
          }
          return genres;
        })
      );
  }

  getMoviesTop(): Observable<any[]> {
    const url = `${this.apiUrl}/movies/top`;
    return this.http.get<any[]>(url);
  }

  getMoviesPopular(): Observable<any[]> {
    const url = `${this.apiUrl}/movies/popular`;
    return this.http.get<any[]>(url);
  }

  getMoviesByGenres(
    genre: string,
    limit?: number,
    page?: number
  ): Observable<any[]> {
    const url = `${this.apiUrl}/movies/genres?genre=${genre}&limit=${limit}&page=${page}`;
    return this.http
      .get<{ movies: any[] }>(url)
      .pipe(map((response) => response.movies));
  }

  searchMovies(title: string, year: string, genre: string): Observable<any[]> {
    const url = `${this.apiUrl}/movies/search?title=${title}&year=${year}&genre=${genre}`;
    return this.http.get<any[]>(url);
  }
}
