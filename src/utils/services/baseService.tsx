import { BehaviorSubject, catchError, from, map, Observable, Subject, throwError } from 'rxjs';
import apiClient from '../../api/apiClient';
import type { ResponseData } from '../interfaces';
export interface refreshList {
    mode: 'create' | 'update' | 'delete';
}
export interface typeModal {
    open: boolean;
    mode: 'create' | 'update' | 'delete' | 'view' | 'close';
    record?: any;
}
export class BaseService {
    private url: string;
    constructor(url: string) {
        this.url = url;
    }
    private refreshSubject = new Subject<refreshList>();
    private modalSubject = new BehaviorSubject<typeModal>({
        open: false,
        mode: 'create',
    });
    // ================= OBSERVABLE =================
    modal$ = this.modalSubject.asObservable();
    refresh$ = this.refreshSubject.asObservable();
    // ================= COMMON ERROR HANDLER =================
    private handleError(err: any, action: string) {
        const msg = err?.response?.data?.Message ?? err?.response?.data?.message ?? 'Có lỗi xảy ra';
        console.error(`Error ${action}:`, msg);
        return throwError(() => err);
    }
    // ================= GET MANY =================
    protected getMany<R = any>(params?: any): Observable<R> {
        return from(apiClient.get<R>(this.url, { params })).pipe(
            map((res) => res.data),
            catchError((err) => this.handleError(err, 'fetching data')),
        );
    }
    // ================= GET ONE =================
    protected getOne<R = any>(id: string): Observable<ResponseData<R>> {
        return from(apiClient.get<ResponseData<R>>(this.url + `/${id}`)).pipe(
            map((res) => res.data),
            catchError((err) => this.handleError(err, 'get data')),
        );
    }
    // ================= POST =================
    protected post<R = any, D = any>(data?: D): Observable<ResponseData<R>> {
        return from(apiClient.post<ResponseData<R>>(this.url, data)).pipe(
            map((res) => {
                return res.data;
            }),
            catchError((err) => this.handleError(err, 'posting data')),
        );
    }
    // ================= UPDATE =================
    protected put<R = any, D = any>(id: string, data?: D): Observable<ResponseData<R>> {
        return from(apiClient.put<ResponseData<R>>(this.url + `/${id}`, data)).pipe(
            map((res) => {
                return res.data;
            }),
            catchError((err) => this.handleError(err, 'updating data')),
        );
    }
    // ================= DELETE =================
    protected del<R = any>(id: string | number): Observable<ResponseData<R>> {
        return from(apiClient.delete<ResponseData<R>>(this.url + `/${id}`)).pipe(
            map((res) => {
                return res.data;
            }),
            catchError((err) => this.handleError(err, 'deleting data')),
        );
    }
    // ================= CUSTOM REQUEST =================
    private request<R = any>(
        method: 'get' | 'post' | 'put' | 'delete',
        endpoint: string,
        data?: any,
        params?: any,
    ): Observable<R> {
        return from(
            apiClient({
                method,
                url: `${this.url}${endpoint}`,
                data,
                params,
            }),
        ).pipe(
            map((res) => res.data),
            catchError((err) => this.handleError(err, `${method} request`)),
        );
    }
    protected customPost<R = any, D = any>(endpoint: string, data?: D): Observable<R> {
        return this.request<R>('post', endpoint, data);
    }
    protected customPut<R = any, D = any>(endpoint: string, data?: D): Observable<R> {
        return this.request<R>('put', endpoint, data);
    }
    protected customDelete<R = any>(endpoint: string): Observable<R> {
        return this.request<R>('delete', endpoint);
    }
    // ================= REFRESH =================
    refreshList(mode: 'create' | 'update' | 'delete' = 'create') {
        this.refreshSubject.next({ mode });
    }
    // ================= MODAL =================
    openModal(
        mode: 'create' | 'update' | 'delete' | 'view',
        record?: any
    ) {
        this.modalSubject.next({
            open: true,
            mode,
            record,
        });
    }

    closeModal() {
        this.modalSubject.next({
            open: false,
            mode: 'close',
        });
    }
}
