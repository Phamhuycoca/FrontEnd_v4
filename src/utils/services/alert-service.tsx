import { Subject } from "rxjs";

export interface AlertState {
    content: string;
    title?: string;
    type: 'success' | 'error' | 'info' | 'warning';
}

class AlertService {
    private alertSubject = new Subject<AlertState>();

    alert$ = this.alertSubject.asObservable();

    success(content: string, title?: string) {
        this.alertSubject.next({ type: 'success', content, title });
    }

    error(content: string, title?: string) {
        this.alertSubject.next({ type: 'error', content, title });
    }

    info(content: string, title?: string) {
        this.alertSubject.next({ type: 'info', content, title });
    }

    warning(content: string, title?: string) {
        this.alertSubject.next({ type: 'warning', content, title });
    }
    clear() {
        this.alertSubject.next({ content: '', type: 'success' });
    }
}

export default new AlertService();