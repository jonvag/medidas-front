export interface Client {
    id?:string;
    user_id?: string;
    client_id?: string;
    name: string; 
    email: string; 
    sexo: string;
    born: Date;
    age: number;
    peso: number;
    estatura: number;
    circunferencia?:string;
    muneca?:string;
    brazo?:string;
    abdominal?:string;
    cadera?:string;
    triceps?:string;
    subescapular?:string;
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
    estatura:string;
    cintura:string;
    muneca:string;
    brazo:string;
    abdominal:string;
    cadera:string;
    triceps:string;
    subescapular:string;
    gct?:number;
    updatedAt?:string;
    createdAt?:string;
    
}

export interface Goals {
    client_id?:string;
    motivo_consulta:string;
    obje_esperado:string;
    tabaco:string;
    alcohol:string;
    hora_dormir:string;
    hora_despertar:string;
    horas_sueno:string;
    info_adicional:string;
}
