export interface Certificate {
    name: string
    provider: string
    issued_at: Date
    expires_at?: Date | null
    filename: string
}