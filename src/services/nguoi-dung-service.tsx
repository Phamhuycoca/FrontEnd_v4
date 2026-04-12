import { Subject } from 'rxjs';
import { BaseService } from './baseService';

class NguoiDungService extends BaseService<any> {
    private sendToViewSubject = new Subject<any>();
    public sendToView$ = this.sendToViewSubject.asObservable();
    constructor() {
        super('nguoi-dung');
    }
    getList() {
        return this.getMany().subscribe((res) => {
            console.log(res);
        });
    }
}
export default new NguoiDungService();
