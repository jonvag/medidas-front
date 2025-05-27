import { Country } from "./customer";

export interface Client {
    id?:number;
    name: string; 
    sexo: string;
    age: number;
    peso: number;
    estatura: number;
    cc?:string;
    imc?: number;
    tipo?: string;
    country?: Country;
    company?: string;
    date?: string;
    status?: string;
    activity?: number;
}
