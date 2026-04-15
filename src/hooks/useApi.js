import { useState, useCallback } from 'react';
import { Alert } from 'react-native';

/**
 * Custom hook for managing API states (loading, error, data).
 * Includes automatic error alerting.
 */
export function useApi(apiFunc) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiFunc(...args);
      
      if (response.success) {
        setData(response.data);
        return { success: true, data: response.data };
      } else {
        setError(response.error);
        Alert.alert('Error', response.error);
        return { success: false, error: response.error };
      }
    } catch (err) {
      const msg = err.message || 'An unexpected error occurred';
      setError(msg);
      Alert.alert('Error', msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  return {
    data,
    loading,
    error,
    execute,
    setData,
  };
}
