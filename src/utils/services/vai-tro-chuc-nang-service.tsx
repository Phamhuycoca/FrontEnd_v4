import type { VaiTroChucNangType } from "../../modules/dm-chuc-nang/chuc-nang";
import { BaseService } from "./baseService";

class VaiTroChucNangService extends BaseService {
    constructor() {
        super('vai-tro-chuc-nang');
    }
    create(data: VaiTroChucNangType) {
        return this.post(data);
    }
    getById(id: string) {
        return this.getOne<VaiTroChucNangType>(id);
    }
}
export default new VaiTroChucNangService;