import Router from "./Router";

export interface HTTPTransportOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  data?: unknown;
  timeout?: number;
}

export interface HTTPTransportResponse<T = unknown> {
  status: number;
  statusText: string;
  data: T;
  headers: Record<string, string>;
}

class HTTPTransport {
  private baseURL: string;
  private router: Router = new Router('#app');

  constructor(baseURL: string = '') {
    this.baseURL = 'https://ya-praktikum.tech/api/v2' + baseURL;
  }

  private createXHR(): XMLHttpRequest {
    return new XMLHttpRequest();
  }

  private parseHeaders(headersString: string): Record<string, string> {
    const headers: Record<string, string> = {};
    const lines = headersString.trim().split('\n');

    lines.forEach((line) => {
      const index = line.indexOf(':');
      if (index > 0) {
        const key = line.substring(0, index).trim().toLowerCase();
        const value = line.substring(index + 1).trim();
        headers[key] = value;
      }
    });

    return headers;
  }

  private buildURL(url: string, queryParams?: Record<string, string>): string {
    const fullURL = this.baseURL + url;

    if (!queryParams || Object.keys(queryParams).length === 0) {
      return fullURL;
    }

    const urlObj = new URL(fullURL, window.location.origin);

    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlObj.searchParams.append(key, String(value));
      }
    });

    return urlObj.toString();
  }

  private request<T = unknown>(
    url: string,
    options: HTTPTransportOptions
  ): Promise<HTTPTransportResponse<T>> {
    return new Promise((resolve, reject) => {
      const xhr = this.createXHR();
      const { method, headers = {}, data, timeout = 5000 } = options;

      xhr.timeout = timeout;
      xhr.withCredentials = true;

      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status >= 200 && xhr.status < 300) {
            let responseData: T;

            try {
              responseData = xhr.responseText ? JSON.parse(xhr.responseText) : null as T;
            } catch {
              responseData = xhr.responseText as T;
            }

            const response: HTTPTransportResponse<T> = {
              status: xhr.status,
              statusText: xhr.statusText,
              data: responseData,
              headers: this.parseHeaders(xhr.getAllResponseHeaders()),
            };

            resolve(response);
          } else {
            if (xhr.status === 401) {
              this.router.go('/sign-in');
            }
            reject(new Error(`HTTP Error ${xhr.status}: ${xhr.statusText}`));
          }
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error occurred'));
      };

      xhr.ontimeout = () => {
        reject(new Error('Request timeout'));
      };

      xhr.open(method, url, true);

      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      if (method !== 'GET' && data) {
        if (data instanceof FormData) {
          xhr.send(data);
        } else {
          if (!headers['Content-Type']) {
            xhr.setRequestHeader('Content-Type', 'application/json');
          }
          xhr.send(JSON.stringify(data));
        }
      } else {
        xhr.send();
      }
    });
  }

  public get<T>(
    url: string,
    queryParams?: Record<string, string>,
    options: Partial<HTTPTransportOptions> = {}
  ): Promise<HTTPTransportResponse<T>> {
    const fullURL = this.buildURL(url, queryParams);
    return this.request<T>(fullURL, {
      method: 'GET',
      ...options,
    });
  }

  public post<T>(
    url: string,
    data?: unknown,
    options: Partial<HTTPTransportOptions> = {}
  ): Promise<HTTPTransportResponse<T>> {
    const fullURL = this.buildURL(url);
    return this.request<T>(fullURL, {
      method: 'POST',
      data,
      ...options,
    });
  }

  public put<T>(
    url: string,
    data?: unknown,
    options: Partial<HTTPTransportOptions> = {}
  ): Promise<HTTPTransportResponse<T>> {
    const fullURL = this.buildURL(url);
    return this.request<T>(fullURL, {
      method: 'PUT',
      data,
      ...options,
    });
  }

  public delete<T>(
    url: string,
    data?: unknown,
    options: Partial<HTTPTransportOptions> = {}
  ): Promise<HTTPTransportResponse<T>> {
    const fullURL = this.buildURL(url);
    return this.request<T>(fullURL, {
      method: 'DELETE',
      data,
      ...options,
    });
  }
}

export default HTTPTransport;
