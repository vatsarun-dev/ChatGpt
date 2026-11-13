export type AuthResponseUser={
    id:string,
    name:string,
    email:string,
    password:string,
    access_token:string,
    refresh_token:string
}

export type RegisterUserRequest=Pick<AuthResponseUser,"id"|"name"|"email"|"password"|"access_token"|"refresh_token">
export type LoginUserRequest=Pick<AuthResponseUser, "email"|"password">
