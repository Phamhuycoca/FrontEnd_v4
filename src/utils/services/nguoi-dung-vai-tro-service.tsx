import type { NguoiDungVaiTroType } from "../../modules/dm-vai-tro/vai-tro";
import { BaseService } from "./baseService";

class NguoiDungVaiTroService extends BaseService {
    constructor() {
        super('nguoi-dung-vai-tro');
    }
    create(data: NguoiDungVaiTroType) {
        return this.post(data);
    }
    update(id: string, data: NguoiDungVaiTroType) {
        return this.put(id, data)
    }
    getById(id: string) {
        return this.getOne<NguoiDungVaiTroType>(id);
    }
}
export default new NguoiDungVaiTroService;