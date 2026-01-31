import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, timeout } from 'rxjs';
import { APP_CONFIG } from '../config/app-config.token';
import { Plan } from '../api/plan';

@Injectable({
  providedIn: 'root'
})
export class PlansService {

  private http = inject(HttpClient);
  private appConfig = inject(APP_CONFIG); //Se trae url base dependiendo si es Dev o Prod

  private urlBase = this.appConfig.apiUrl;

  constructor() { }

  getPlansClients(id_user: string): Observable<any> {
    console.log("id_user ", id_user);
    return this.http.get(`${this.urlBase}/api/pacientes/plan/user/${id_user}`).pipe(timeout(2000));
  }

  putClientPlan(form: Plan) {
    const userSessionName = localStorage.getItem('userSessionName');
    let headers = new HttpHeaders();

    if (userSessionName) {
      headers = headers.set('X-User-Session-Name', userSessionName);
    }

    return this.http.put<Plan>(`${this.urlBase}/api/pacientes/plan`, form, {
      headers: headers,
      responseType: 'json',
      observe: 'response'
    });
  }
}
