import type { ChucNangType } from "../../modules/dm-chuc-nang/chuc-nang";
import { BaseService } from "./baseService";

class ChucNangService extends BaseService {
    constructor() {
        super('Admin/chuc-nang');
    }
    create(data: ChucNangType) {
        return this.post(data);
    }
    update(id: string, data: ChucNangType) {
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
export default new ChucNangService();