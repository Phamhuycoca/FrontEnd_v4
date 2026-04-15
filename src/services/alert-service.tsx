import { BehaviorSubject } from 'rxjs';

export interface AlertState {
    content: string;
    title?: string;
    type: 'success' | 'error' | 'info' | 'warning';
}

class AlertService {
    private alertSubject = new BehaviorSubject<AlertState>({ content: '', type: 'success' });

    alert$ = this.alertSubject.asObservable();

    success(content: string, title?: string) {
        this.alertSubject.next({
            type: 'success',
            content,
            title,
        });
    }

    error(content: string, title?: string) {
        this.alertSubject.next({
            type: 'error',
            content,
            title,
        });
    }

    info(content: string, title?: string) {
        this.alertSubject.next({
            type: 'info',
            content,
            title,
        });
    }

    warning(content: string, title?: string) {
        this.alertSubject.next({
            type: 'warning',
            content,
            title,
        });
    }
}

export default new AlertService();