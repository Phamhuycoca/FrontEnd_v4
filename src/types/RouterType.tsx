export interface TypeRouter {
    path: string;
    element: React.ReactNode;
    private?: boolean | false;
    permission?: string[];
    children?: TypeRouter[];
}