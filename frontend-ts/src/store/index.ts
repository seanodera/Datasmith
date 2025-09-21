import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from 'react-redux'
import MainReducer from "./mainSlice";


export const store = configureStore({
    reducer: {
        main: MainReducer
    }
})

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes()
export * from './mainSlice'
export {parseFileAsync} from "@/store/parseFileAsync.tsx";