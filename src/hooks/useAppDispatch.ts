// hooks/useAppDispatch.ts
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../redux/app/store'


export const useAppDispatch = () => useDispatch<AppDispatch>()
