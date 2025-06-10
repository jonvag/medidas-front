export interface Alimento {
    id: number;
    name: string;
    medidaPractica?: string;
    gramos: number;
    category?: string;
    subCategory?: string;
    image?: string;
}

export interface CartItem {
  alimento: Alimento;
  quantity: number;
}