import { BehaviorSubject } from 'rxjs';

export type ConfirmModalState = {
    open: boolean;
    title?: string;
    content?: string;
    resolve: (value: boolean) => void;
};

class ConfirmService {
    private modalSubject = new BehaviorSubject<ConfirmModalState | null>(null);

    modal$ = this.modalSubject.asObservable();

    confirm(
        title?: string | 'Thông báo',
        content?: string | 'Bạn có muốn xóa thông tin này',
    ): Promise<boolean> {
        return new Promise((resolve) => {
            this.modalSubject.next({
                open: true,
                title,
                content,
                resolve,
            });
        });
    }

    close() {
        this.modalSubject.next(null);
    }
}

export default new ConfirmService();