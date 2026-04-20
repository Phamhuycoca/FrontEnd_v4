import type { VaiTroDanhMucTroType } from "../../modules/dm-danh-muc/danh-muc";
import { BaseService } from "./baseService";

class VaiTroDanhMucTroService extends BaseService {
    constructor() {
        super('Admin/vai-tro-danh-muc');
    }
    create(data: VaiTroDanhMucTroType) {
        return this.post(data);
    }
    getById(id: string) {
        return this.getOne<VaiTroDanhMucTroType>(id);
    }
}
export default new VaiTroDanhMucTroService;