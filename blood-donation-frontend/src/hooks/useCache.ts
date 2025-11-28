import { useAppDispatch, useAppSelector } from '../store/hooks';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const loadingStates = new Set<string>();

export const useCache = (sliceName: string, fetchAction: any) => {
  const dispatch = useAppDispatch();
  const slice = useAppSelector((state: any) => state[sliceName]);
  
  const loadData = async (forceRefresh = false) => {
    if (loadingStates.has(sliceName) || slice.loading) return;
    
    const shouldRefetch = forceRefresh || !slice.data || !slice.lastFetched || 
      (Date.now() - slice.lastFetched > CACHE_DURATION);
    
    if (shouldRefetch) {
      loadingStates.add(sliceName);
      try {
        await dispatch(fetchAction()).unwrap();
      } finally {
        loadingStates.delete(sliceName);
      }
    }
  };

  return { data: slice.data, loading: slice.loading, loadData };
};