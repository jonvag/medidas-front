import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable } from 'rxjs';
import { APP_CONFIG } from '../config/app-config.token';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private http = inject(HttpClient);
  private appConfig = inject(APP_CONFIG); //Se trae url base dependiendo si es Dev o Prod

  private urlBase = this.appConfig.apiUrl;

  constructor() { }

  getUsers(): Observable<any> {
    
    return this.http.get(`${this.urlBase}/api/usuarios`);
  }


  getClient(): Observable<any> {
    
    return this.http.get(`${this.urlBase}/api/client`);
  }

  //ejemplo apis con header

 /*  getPlatformsId(id: string): Observable<any> {
    const apiurlTriggers: string = `${this.urlBase}/admin/platform/${id}`;

    return this.http.get(apiurlTriggers);
  }

  putPlatformsId(form: any) {
    const appUrl: string = `${this.urlBase}/admin/platform/${form.idPlatform}`;
    const userSessionName = localStorage.getItem('userSessionName');
    let headers = new HttpHeaders();
    if (userSessionName) {
      headers = headers.set('X-User-Session-Name', userSessionName);
    }

    return this.http.put(`${appUrl}`, form, {
      ...Option,
      headers: headers,
      responseType: 'json',
    }).pipe(delay(1000));
  } */
}
