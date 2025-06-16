import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable, timeout } from 'rxjs';
import { APP_CONFIG } from '../config/app-config.token';
import { Client } from '../api/client';
import { User } from '../api/user';

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

  getClientsById(id_user: number): Observable<any> {

    return this.http.get(`${this.urlBase}/api/client/client-user/${id_user}`).pipe(timeout(2000));
  }

  deleteClient(id_client: number): Observable<any> {
    console.log("api eliminar cliente ", id_client)
    return this.http.delete(`${this.urlBase}/api/client/${id_client}`);
  }

  //ejemplo apis con header

  postClientById(form: Client) {
    const userSessionName = localStorage.getItem('userSessionName');
    let headers = new HttpHeaders();
    if (userSessionName) {
      headers = headers.set('X-User-Session-Name', userSessionName);
    }

    console.log("for de crear ", form)

    return this.http.post(`${this.urlBase}/api/client`, form, {
      ...Option,
      headers: headers,
      responseType: 'json',
      observe: 'response'
    });
  }

  updateClient(form: Client) { // <-- Tipo de retorno y parámetro

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
    const userSessionName = localStorage.getItem('userSessionName');
    let headers = new HttpHeaders();
    if (userSessionName) {
      headers = headers.set('X-User-Session-Name', userSessionName);
    }

const register = {
  name:form.name,
  lastname:form.lastname,
  email:form.email,
  status:true,
  pass:form.password1
}

    return this.http.post(`${this.urlBase}/api/usuarios`, register, {
      ...Option,
      headers: headers,
      responseType: 'json',
      observe: 'response'
    });
  }

}
