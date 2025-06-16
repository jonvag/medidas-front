export interface User {
    name: string; 
    lastname: string; 
    email: string; 
    password1: string; 
    password2?: string; 
    status?: boolean;
}

export interface UserLogin {
    email: string; 
    password1: string; 
}

