import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import type { CustomJwtPayload } from "../../types/JwtPayload";

export interface AuthState {
    nguoi_dung_id: string | null;
    accessToken: string | null;
    permissions: string[];
    menu: any[];
    isAuthenticated: boolean;
    loading: boolean;
    vai_tro: string[];
}

const initialState: AuthState = {
    nguoi_dung_id: null,
    accessToken: null,
    permissions: [],
    menu: [],
    vai_tro: [],
    isAuthenticated: false,
    loading: false
};

const applyTokenData = (state: AuthState, token: string) => {
    const decodeToken = jwtDecode<CustomJwtPayload>(token);

    state.accessToken = token;
    state.nguoi_dung_id = decodeToken.jti;
    state.vai_tro = Array.isArray(decodeToken.vai_tro)
        ? decodeToken.vai_tro
        : decodeToken.vai_tro
            ? [decodeToken.vai_tro]
            : [];

    state.permissions = Array.isArray(decodeToken.permissions)
        ? decodeToken.permissions
        : decodeToken.permissions
            ? [decodeToken.permissions]
            : [];

    state.menu = decodeToken.menu
        ? JSON.parse(decodeToken.menu)
        : [];

    state.isAuthenticated = true;
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLogin: (state, action: PayloadAction<string>) => {
            applyTokenData(state, action.payload);
        },

        setAccessToken: (state, action: PayloadAction<string>) => {
            applyTokenData(state, action.payload);
        },

        setMenu: (state, action: PayloadAction<any[]>) => {
            state.menu = action.payload;
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },

        logout: (state) => {
            Object.assign(state, initialState);
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