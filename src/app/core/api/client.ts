export interface Client {
    id?:number;
    user_id?: number;
    client_id?: number;
    name: string; 
    email: string; 
    sexo: string;
    age: number;
    peso: number;
    estatura: number;
    circunferencia?:string;
    imc?: number;
    tipo?: string;
    address?: string;
    company?: string;
    date?: string;
    status?: string;
    activity?: number;
}
