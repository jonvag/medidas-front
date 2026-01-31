export interface Plan {
    id?:number;
    client_id?: number;
    lacteos: string;
    vegetales: string; 
    frutas: string; 
    almidones: string;
    carnes_magra: string;
    carnes_semi: string;
    carnes_grasa: string;
    grasas: string;
    updatedAt?: Date;
    createdAt?: Date;
    
}