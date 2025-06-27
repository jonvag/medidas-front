export interface Client {
    id?:string;
    user_id?: string;
    client_id?: string;
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

export interface PesoClient {
    id:number;
    client_id:string;
    peso:string;
    updatedAt?:string;
    createdAt?:string;
    
}
