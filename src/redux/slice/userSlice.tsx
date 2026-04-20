import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
    id: string | null;
    ten_day_du: string | null;
    anh_dai_dien: string | null;
    gioi_tinh_id: string | null;
    ten_dang_nhap: string | null;
}

const initialState: UserState = {
    id: null,
    ten_day_du: null,
    anh_dai_dien: null,
    gioi_tinh_id: null,
    ten_dang_nhap: null
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            return { ...state, ...action.payload };
        },

        clearUser: () => initialState
    }
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;