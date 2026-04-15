export interface MenuItem {
    ten: string | null;
    icon: string | null;
    duong_dan: string | null;
    so_thu_tu: number | null;
    children?: MenuItem[];
}
export interface MetaState {
    page: number;
    page_size: number;
    search: string;
    sort: string;
    filter: string;
    total: number;
}
export interface ItemSelect {
    id: string;
    ten: string;
}
export interface PaginationMeta {
    page: number;
    page_size: number;
    ranger: {
        from: number;
        to: number;
    };
    total: number;
    total_page: number;
}

export interface PagedResponse<T> {
    meta: PaginationMeta;
    data: T;
}
export interface ResponseData<T> {
    statusCode: number;
    data: T;
    success: boolean;
    message: string;
}