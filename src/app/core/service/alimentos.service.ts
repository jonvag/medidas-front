import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlimentosService {

  constructor(private http: HttpClient) { }

  getAlimentos(): Observable<any> {
      
    return this.http.get('assets/demo/data/alimentos.json');
  }
}
