
export enum Role{
    "MAINTAINER" = "maintainer",
    "CONTRIBUTOR" = 'contributor'
}


export interface Iuser{
    name: string,
    email: string,
    password: string,
    role?: string
}

export type TLogin ={
    email : string,
    password: string
}