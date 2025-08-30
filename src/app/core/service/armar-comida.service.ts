import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArmarComidaService {
  private http = inject(HttpClient);

  constructor() { }

  armarComida(form: any): Observable<any> {
    console.log("Enviando datos al servidor:", form);

    return this.http.post(
      'http://3.87.19.83/webhook/3ba53e66-5047-471d-92f9-d3c98d8b810b',
      {
        tipo_comida: form.tipo,
        porciones: form.porciones
      }
    );
  }

}
