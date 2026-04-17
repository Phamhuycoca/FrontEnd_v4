import { Subject } from 'rxjs';

export interface MessageState {
    type: 'success' | 'error' | 'info' | 'warning';
    content: string;
}

class MessageService {
    private messageSubject = new Subject<MessageState>();
    message$ = this.messageSubject.asObservable();

    success(content: string) {
        this.messageSubject.next({ type: 'success', content });
    }

    error(content: string) {
        this.messageSubject.next({ type: 'error', content });
    }

    info(content: string) {
        this.messageSubject.next({ type: 'info', content });
    }

    warning(content: string) {
        this.messageSubject.next({ type: 'warning', content });
    }
}

export default new MessageService();