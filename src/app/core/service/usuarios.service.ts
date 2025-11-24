import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, delay, Observable, throwError, timeout } from 'rxjs';
import { APP_CONFIG } from '../config/app-config.token';
import { Client } from '../api/client';
import { User, UserLogin } from '../api/user';

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

  getClientsById(id_user: string): Observable<any> {
    console.log("id_user ", id_user);
    return this.http.get(`${this.urlBase}/api/client/client-user/${id_user}`).pipe(timeout(2000));
  }

  deleteClient(id_client: number): Observable<any> {
    return this.http.delete(`${this.urlBase}/api/client/${id_client}`);
  }


  postClientById(form: Client) {
    const userSessionName = localStorage.getItem('userSessionName');
    let headers = new HttpHeaders();
    if (userSessionName) {
      headers = headers.set('X-User-Session-Name', userSessionName);
    }

    return this.http.post(`${this.urlBase}/api/client`, form, {
      ...Option,
      headers: headers,
      responseType: 'json',
      observe: 'response'
    });
  }

  updateClient(form: Client) {

    const userSessionName = localStorage.getItem('userSessionName');
    let headers = new HttpHeaders();

    if (userSessionName) {
      headers = headers.set('X-User-Session-Name', userSessionName);
    }

    return this.http.put<Client>(`${this.urlBase}/api/client/${form.client_id}`, form, {
      headers: headers,
      responseType: 'json',
      observe: 'response'
    });
  }

  createUser(form: User) {

    const register = {
      name: form.name,
      lastname: form.lastname,
      email: form.email,
      status: true,
      pass: form.password1
    }

    return this.http.post(`${this.urlBase}/auth/register`, register, {
      ...Option,
      responseType: 'json',
      observe: 'response'
    });
  }

  loginUser(form: UserLogin) {

    const user = {
      email: form.email,
      pass: form.password1
    };

    return this.http.post(`${this.urlBase}/auth/login`, user, {
      ...Option,
      responseType: 'json',
      observe: 'response'
    });
  }

  getClientInfoById(idClient: string): Observable<any> {

    return this.http.get(`${this.urlBase}/api/client/client-info/${idClient}`);
  }

  getPesoClientById(idClient: string): Observable<any> {

    return this.http.get(`${this.urlBase}/api/client/client-peso/${idClient}`);
  }

}
