import { IncomingMessage, ServerResponse, type OutgoingHttpHeaders } from 'node:http';
import { Duplex } from 'node:stream';
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { createApiApp } from '../../server/apiApp.ts';

const apiApp = createApiApp();

function normalizeApiPath(pathname: string): string {
  if (pathname.startsWith('/.netlify/functions/api')) {
    const suffix = pathname.slice('/.netlify/functions/api'.length);
    if (!suffix || suffix === '/') {
      return '/api/health';
    }
    if (suffix.startsWith('/api/') || suffix === '/api') {
      return suffix;
    }
    return `/api${suffix.startsWith('/') ? '' : '/'}${suffix}`;
  }

  if (pathname === '/' || pathname === '') {
    return '/api/health';
  }
  if (pathname.startsWith('/api/') || pathname === '/api') {
    return pathname;
  }
  return `/api${pathname.startsWith('/') ? '' : '/'}${pathname}`;
}

export default async function handler(webReq: Request): Promise<Response> {
  if (webReq.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': webReq.headers.get('origin') || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-ALGB-Session',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  }

  const url = new URL(webReq.url);
  const targetPath = normalizeApiPath(url.pathname);
  const targetUrl = `${targetPath}${url.search}`;

  const socket = new Duplex({
    read() {},
    write(_chunk, _encoding, callback) {
      callback();
    },
  }) as Duplex & {
    remoteAddress?: string;
    encrypted?: boolean;
  };
  socket.remoteAddress =
    webReq.headers.get('x-nf-client-connection-ip') ||
    webReq.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    '127.0.0.1';
  socket.encrypted = url.protocol === 'https:';

  const nodeReq = new IncomingMessage(socket as unknown as import('node:net').Socket);
  nodeReq.method = webReq.method;
  nodeReq.url = targetUrl;

  const headersObj: Record<string, string> = {};
  webReq.headers.forEach((value, key) => {
    headersObj[key.toLowerCase()] = value;
  });
  if (!headersObj['x-forwarded-proto']) {
    headersObj['x-forwarded-proto'] = url.protocol.replace(':', '') || 'https';
  }
  let bodyBuffer: Buffer | null = null;
  if (webReq.method !== 'GET' && webReq.method !== 'HEAD') {
    const bodyArrayBuffer = await webReq.arrayBuffer();
    if (bodyArrayBuffer.byteLength > 0) {
      bodyBuffer = Buffer.from(bodyArrayBuffer);
      delete headersObj['transfer-encoding'];
      headersObj['content-length'] = String(bodyBuffer.byteLength);
    }
  }
  nodeReq.headers = headersObj;

  if (bodyBuffer) {
    nodeReq.push(bodyBuffer);
  }
  nodeReq.push(null);

  return await new Promise<Response>((resolve) => {
    const nodeRes = new ServerResponse(nodeReq);
    const chunks: Buffer[] = [];
    let settled = false;

    const collectChunk = (
      chunk: unknown,
      encoding?: BufferEncoding
    ) => {
      if (chunk === undefined || chunk === null) return;
      if (Buffer.isBuffer(chunk)) {
        chunks.push(chunk);
      } else if (chunk instanceof Uint8Array) {
        chunks.push(Buffer.from(chunk));
      } else if (typeof chunk === 'string') {
        chunks.push(Buffer.from(chunk, encoding || 'utf8'));
      }
    };

    const finalize = () => {
      if (settled) return;
      settled = true;

      const outHeaders = new Headers();
      const rawHeaders = nodeRes.getHeaders();
      for (const [key, value] of Object.entries(rawHeaders)) {
        if (value === undefined) continue;
        if (Array.isArray(value)) {
          for (const item of value) {
            outHeaders.append(key, String(item));
          }
        } else {
          outHeaders.set(key, String(value));
        }
      }

      if (!outHeaders.has('content-type')) {
        outHeaders.set('content-type', 'application/json; charset=utf-8');
      }

      const bodyBuffer = Buffer.concat(chunks);
      const status = nodeRes.statusCode || 200;
      const responseBody =
        status === 204 || status === 304 || webReq.method === 'HEAD'
          ? null
          : bodyBuffer;

      resolve(
        new Response(responseBody, {
          status,
          headers: outHeaders,
        })
      );
    };

    nodeRes.writeHead = function writeHead(
      statusCode: number,
      reasonOrHeaders?: string | OutgoingHttpHeaders | readonly (string | number)[],
      maybeHeaders?: OutgoingHttpHeaders | readonly (string | number)[]
    ) {
      nodeRes.statusCode = statusCode;
      const hdrs =
        typeof reasonOrHeaders === 'object' && reasonOrHeaders !== null
          ? reasonOrHeaders
          : typeof maybeHeaders === 'object' && maybeHeaders !== null
          ? maybeHeaders
          : undefined;
      if (hdrs && !Array.isArray(hdrs)) {
        for (const [k, v] of Object.entries(hdrs)) {
          if (v !== undefined) {
            nodeRes.setHeader(k, v as string | number | readonly string[]);
          }
        }
      }
      return nodeRes;
    } as typeof nodeRes.writeHead;

    nodeRes.write = function write(
      chunk: unknown,
      encodingOrCb?: BufferEncoding | ((error: Error | null | undefined) => void),
      cb?: (error: Error | null | undefined) => void
    ): boolean {
      const encoding = typeof encodingOrCb === 'string' ? encodingOrCb : undefined;
      const callback = typeof encodingOrCb === 'function' ? encodingOrCb : cb;
      collectChunk(chunk, encoding);
      if (callback) callback(null);
      return true;
    } as typeof nodeRes.write;

    nodeRes.end = function end(
      chunkOrCb?: unknown,
      encodingOrCb?: BufferEncoding | (() => void),
      cb?: () => void
    ) {
      const callback =
        typeof chunkOrCb === 'function'
          ? (chunkOrCb as () => void)
          : typeof encodingOrCb === 'function'
          ? encodingOrCb
          : cb;
      if (chunkOrCb !== undefined && typeof chunkOrCb !== 'function') {
        const encoding = typeof encodingOrCb === 'string' ? encodingOrCb : undefined;
        collectChunk(chunkOrCb, encoding);
      }
      finalize();
      if (callback) callback();
      return nodeRes;
    } as typeof nodeRes.end;

    try {
      apiApp(
        nodeReq as unknown as ExpressRequest,
        nodeRes as unknown as ExpressResponse,
        (err?: unknown) => {
        if (err && !settled) {
          console.error('Erreur Express Netlify API:', err);
          settled = true;
          resolve(
            Response.json(
              { ok: false, error: 'Erreur interne du serveur API ALGB.' },
              { status: 500 }
            )
          );
        } else if (!settled) {
          finalize();
        }
      });
    } catch (err) {
      console.error('Exception Express Netlify API:', err);
      if (!settled) {
        settled = true;
        resolve(
          Response.json(
            { ok: false, error: 'Erreur interne du serveur API ALGB.' },
            { status: 500 }
          )
        );
      }
    }
  });
}
