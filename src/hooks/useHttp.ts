import axios from "axios";
import { useState } from "react";

export interface useHttpParams {
  url: string,
  callback?(): void
  initialLoading?: boolean
}

export interface useHttpOutput<T> {
  result: T | undefined
  get(config?: useHttpConfig): Promise<T | undefined>
  post(body?: any, config?: useHttpConfig): Promise<T | undefined>
  put(body?: any, config?: useHttpConfig): Promise<T | undefined>
  del(config?: useHttpConfig): Promise<T | undefined>
  loading: boolean
  error: string
}

export interface useHttpConfig {
  query?: any
  params?: {[key: string]: string | number}
}

export type useHttpInstance = <T>(params: useHttpParams) => useHttpOutput<T>;

export function useHttp<T>(params: useHttpParams): useHttpOutput<T> {
  const [loading, setLoading] = useState<boolean>(params.initialLoading ?? false);
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<T>();

  function parseUrl(config?: useHttpConfig) {
    if (!config?.params) {
      return params.url;
    }

    let url = params.url;
    Object.keys(config.params).forEach((key: string) => {
      url = url.replace(`:${key}`, String(config.params![key]));
    });
    return url;
  }

  async function get(config?: useHttpConfig): Promise<T | undefined> {
    setLoading(true);
    try {
      const data: T = (await axios.get(parseUrl(config), { params: config?.query })).data;
      setResult(data);
      return data;
    } catch (err: any) {
      setError(err.response.data.toString());
      throw err;
    } finally {
      setLoading(false);
      params.callback && params.callback();
    }
  }

  async function post(body?: any, config?: useHttpConfig): Promise<T | undefined> {
    setLoading(true);
    try {
      const data: T = (await axios.post(parseUrl(config), body, { params: config?.query })).data;
      setResult(data);
      return data;
    } catch (err: any) {
      setError(err.response.data.toString());
      throw err;
    } finally {
      setLoading(false);
      params.callback && params.callback();
    }
  }

  async function put(body?: any, config?: useHttpConfig): Promise<T | undefined> {
    setLoading(true);
    try {
      const data: T = (await axios.put(parseUrl(config), body, { params: config?.query })).data;
      setResult(data);
      return data;
    } catch (err: any) {
      setError(err.response.data.toString());
      throw err;
    } finally {
      setLoading(false);
      params.callback && params.callback();
    }
  }

  async function del(config?: useHttpConfig): Promise<T | undefined> {
    setLoading(true);
    try {
      const data: T = (await axios.delete(parseUrl(config), { params: config?.query })).data;
      setResult(data);
      return data;
    } catch (err: any) {
      setError(err.response.data.toString());
      throw err;
    } finally {
      setLoading(false);
      params.callback && params.callback();
    }
  }

  return {
    result,
    loading,
    error,
    get,
    post,
    put,
    del
  };
}
