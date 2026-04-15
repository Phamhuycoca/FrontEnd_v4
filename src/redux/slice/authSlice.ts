import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import type { CustomJwtPayload } from "../../types/JwtPayload";

export interface AuthState {
    nguoi_dung_id: string | null;
    accessToken: string | null;
    permissions: string[] | string;
    menu: any[];
    isAuthenticated: boolean;
    loading: boolean;
    vai_tro: string[] | string;
}

const initialState: AuthState = {
    nguoi_dung_id: null,
    accessToken: null,
    isAuthenticated: false,
    permissions: [],
    menu: [],
    vai_tro: [],
    loading: false
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLogin: (
            state,
            action: PayloadAction<string>
        ) => {
            const decodeToken = jwtDecode<CustomJwtPayload>(
                action.payload
            );
            state.accessToken = action.payload;
            state.nguoi_dung_id = decodeToken.jti;
            state.vai_tro = decodeToken.vai_tro;
            state.permissions = decodeToken.permissions || [];
            state.menu = decodeToken.menu
                ? JSON.parse(decodeToken.menu)
                : [];
            state.isAuthenticated = true;
        },

        setAccessToken: (
            state,
            action: PayloadAction<string>
        ) => {
            const decodeToken = jwtDecode<CustomJwtPayload>(
                action.payload
            );
            state.accessToken = action.payload;
            state.nguoi_dung_id = decodeToken.jti;
            state.permissions = decodeToken.permissions || [];
            state.vai_tro = decodeToken.vai_tro;
            state.menu = decodeToken.menu
                ? JSON.parse(decodeToken.menu)
                : [];
            state.isAuthenticated = true;
        },

        setMenu: (
            state,
            action: PayloadAction<any[]>
        ) => {
            state.menu = action.payload;
        },

        logout: (state) => {
            state.accessToken = null;
            state.nguoi_dung_id = null;
            state.permissions = [];
            state.menu = [];
            state.vai_tro = [];
            state.isAuthenticated = false;
        },

        setLoading: (
            state,
            action: PayloadAction<boolean>
        ) => {
            state.loading = action.payload;
        }
    }
});

export const {
    setLogin,
    setAccessToken,
    setMenu,
    logout,
    setLoading
} = authSlice.actions;

export default authSlice.reducer;