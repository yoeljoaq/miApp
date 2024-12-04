import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = '647a2863d76ba51e0a134fa85c6ea084'
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  
  constructor(private http: HttpClient) {}

  getWeather(city: string): Observable<any> {
    const url = `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric&lang=es`; // 'metric' para grados Celsius
    return this.http.get<any>(url);
  }
}
