import type { VaiTroType } from "../../modules/dm-vai-tro/vai-tro";
import { BaseService } from "./baseService";

class VaiTroService extends BaseService {
    constructor() {
        super('vai-tro');
    }
    create(data: VaiTroType) {
        return this.post(data);
    }
    update(id: string, data: VaiTroType) {
        return this.put(id, data)
    }
    delete(id: string) {
        return this.del(id);
    }
    getList(params?: any) {
        return this.getMany(params);
    }
    getById(id: string) {
        return this.getOne(id)
    }
}
export default new VaiTroService();