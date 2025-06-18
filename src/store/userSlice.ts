import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Tuser = {
  _id: string;
  name: {
    first: string;
    middle?: string;
    last: string;
  };
  isBusiness: boolean;
  isAdmin?: boolean;
};

type TUserState = {
  user: Tuser | null;
};

const storedUser = localStorage.getItem("user");

const initialState: TUserState = {
  user: storedUser ? JSON.parse(storedUser) : null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<Tuser>) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
