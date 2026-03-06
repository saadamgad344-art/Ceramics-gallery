import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  private getAuthHeaders(): Record<string,string> | undefined {
    const token = localStorage.getItem('token');
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return undefined;
  }

  get<T>(path: string) {
    // ensure we don't end up with double-slash if base already has trailing slash
    const url = `${this.base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
    return this.http.get<T>(url, {
      headers: this.getAuthHeaders(),
      responseType: 'json' as const
    });
  }

  post<T>(path: string, body: any) {
    const postUrl = `${this.base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
    return this.http.post<T>(postUrl, body, {
      headers: this.getAuthHeaders(),
      responseType: 'json' as const
    });
  }

  uploadImage(productId: number, file: File) {
    const postUrl = `${this.base.replace(/\/+$/, '')}/products/${productId}/images`;
    const form = new FormData();
    form.append('file', file);
    return this.http.post<{ id: number; imageUrl: string }>(postUrl, form, {
      headers: this.getAuthHeaders(),
      // let browser set Content-Type
    });
  }

  put<T>(path: string, body: any) {
    const putUrl = `${this.base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
    return this.http.put<T>(putUrl, body, {
      headers: this.getAuthHeaders(),
      responseType: 'json' as const
    });
  }

  delete<T>(path: string) {
    const delUrl = `${this.base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
    return this.http.delete<T>(delUrl, {
      headers: this.getAuthHeaders(),
      responseType: 'json' as const
    });
  }

  // authentication helpers
  login(email: string, password: string) {
    return this.http.post<{ token: string }>(`${this.base}/auth/login`, { email, password });
  }
}

