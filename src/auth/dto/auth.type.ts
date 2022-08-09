export interface Tokens {
    accessToken: string
    refreshToken: string
}

export interface TokenPayload {
    id: string
    email: string
    iat: number,
    exp: number

}
