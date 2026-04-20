import type { AuthResponse } from "../../types/AuthType";
import { BaseService } from "./baseService";

class AuthServcie extends BaseService {
    constructor() {
        super('auth');
    }
    dangNhap(data: any) {
        return this.customPost<AuthResponse>('Admin/dang-nhap', data)
    }
}
export default new AuthServcie();