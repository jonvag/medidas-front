import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { APP_CONFIG } from '../../config/app-config.token';
import { Goals } from '../../api/client';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GoalsService {

  private http = inject(HttpClient);
  private appConfig = inject(APP_CONFIG); //Se trae url base dependiendo si es Dev o Prod
  private urlBase = this.appConfig.apiUrl;

  constructor() { }

  getGoalsById(idClient: string): Observable<any> {

    return this.http.get(`${this.urlBase}/api/pacientes/goals/${idClient}`);
  }

  updateGoals(form: Goals) {

    const userSessionName = localStorage.getItem('userSessionName');
    let headers = new HttpHeaders();

    console.log("form en goals.service:", form);

    if (userSessionName) {
      headers = headers.set('X-User-Session-Name', userSessionName);
    }

    return this.http.put<Goals>(`${this.urlBase}/api/pacientes/goals`, form, {
      headers: headers,
      responseType: 'json',
      observe: 'response'
    });
  }
}
