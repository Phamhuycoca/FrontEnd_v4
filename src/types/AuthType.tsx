interface AuthResponse {
    access_token: string;
    expires_in: number;
}
interface MenuResponse {
    id: string;
    cap_cha_id?: string;
    ten: string;
    icon?: string;
    duong_dan?: string;
    so_thu_tu?: number;
    children?: MenuResponse[];
}
interface VaiTroResponse {
    vai_tro: string[];
}
interface PermissionResponse {
    permission: string[];
}
interface UserResponse {
    id: string;
    tai_khoan: string;
}
export type { AuthResponse, MenuResponse, VaiTroResponse, PermissionResponse, UserResponse };