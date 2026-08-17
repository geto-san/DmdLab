"use client";

export async function api<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(`/api${path}`, { ...options, headers });
  if (res.status === 401) throw new AuthError();
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export class AuthError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "AuthError";
  }
}

export function uploadWithProgress(
  path: string,
  form: FormData,
  onProgress: (sentBytes: number, totalBytes: number) => void
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `/api${path}`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded, e.total);
    };
    xhr.onload = () => {
      let data: unknown = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        // non-JSON body
      }
      if (xhr.status === 401) reject(new AuthError());
      else if (xhr.status >= 200 && xhr.status < 300) resolve(data);
      else reject(new Error((data as { error?: string }).error || `Request failed (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send(form);
  });
}

export class UploadAbortError extends Error {
  constructor() {
    super("Upload cancelled");
    this.name = "UploadAbortError";
  }
}

export function uploadFileWithProgress(
  path: string,
  file: File,
  headers: Record<string, string>,
  onProgress: (sentBytes: number, totalBytes: number) => void
): { promise: Promise<unknown>; abort: () => void } {
  let xhr: XMLHttpRequest;
  const promise = new Promise((resolve, reject) => {
    xhr = new XMLHttpRequest();
    xhr.open("POST", `/api${path}`);
    for (const [key, value] of Object.entries(headers)) xhr.setRequestHeader(key, value);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded, e.total);
    };
    xhr.onload = () => {
      let data: unknown = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        // non-JSON body
      }
      if (xhr.status === 401) reject(new AuthError());
      else if (xhr.status >= 200 && xhr.status < 300) resolve(data);
      else reject(new Error((data as { error?: string }).error || `Request failed (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.onabort = () => reject(new UploadAbortError());
    xhr.send(file);
  });
  return {
    promise,
    abort: () => xhr.abort(),
  };
}
