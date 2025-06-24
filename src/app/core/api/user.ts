export interface User {
    id?:string;
    name: string; 
    lastname: string; 
    email: string; 
    password1: string; 
    password2?: string; 
    status?: boolean;
    token?: string;
}

export interface UserLogin {
    email: string; 
    password1: string; 
}

