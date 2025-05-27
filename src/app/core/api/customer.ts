export interface Country {
    name?: string;
    code?: string;
}

export interface Representative {
    name?: string;
    image?: string;
}

export interface Customer {
    age: number;
    imc?: number;
    id?: number;
    tipo?: string;
    name: string;
    peso: number;
    estatura: number;
    sexo: string;
    country?: Country;
    company?: string;
    date?: string;
    status?: string;
    activity?: number;
    representative?: Representative;
}
