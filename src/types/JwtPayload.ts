import type { JwtPayload } from 'jwt-decode';

export interface CustomJwtPayload extends JwtPayload {
    menu: string;
    permissions: string[] | string;
    vai_tro: string[] | string;
}