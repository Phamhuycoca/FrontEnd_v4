import type { DanhMucType } from "../modules/dm-danh-muc/danh-muc";
import { BaseService } from "./baseService";

class DanhMucService extends BaseService {
    constructor() {
        super('danh-muc')
    }
    create(data: DanhMucType) {
        return this.post(data);
    }
    update(id: string, data: DanhMucType) {
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
export default new DanhMucService;