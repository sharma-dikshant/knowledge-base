import { configureStore } from "@reduxjs/toolkit";
import {postReducer} from "./HomepageMAnagement/PostSlice";

const store = configureStore({
  reducer: {
    posts: postReducer,
  },
});

export default store;
