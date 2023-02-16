export interface AuthResponse{
    code:number,
    auth:string,
    status:string
}

export interface StatusOnlyRes{
    status:boolean
}

export interface idRes{
    code:number
    status:string,
    id:string
}