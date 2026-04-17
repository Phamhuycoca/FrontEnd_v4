import { BaseService } from './baseService';
import type { NguoiDungType } from '../../modules/dm-nguoi-dung/nguoi-dung';

class NguoiDungService extends BaseService {
    constructor() {
        super('nguoi-dung');
    }
    create(data: NguoiDungType) {
        return this.post(data);
    }
    update(id: string, data: NguoiDungType) {
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
export default new NguoiDungService();
