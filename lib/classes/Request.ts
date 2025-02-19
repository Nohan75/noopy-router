import { IncomingMessage } from 'http';
import {IncomingHttpHeaders} from "node:http";

export class Request {
    private rawRequest: IncomingMessage;
    private _body: any;
    public params: Record<string, string> = {};

    constructor(rawRequest: IncomingMessage) {
        this.rawRequest = rawRequest;
    }

    get method(): string {
        return this.rawRequest.method || '';
    }

    get url(): string {
        return this.rawRequest.url || '';
    }

    get headers(): IncomingHttpHeaders {
        return this.rawRequest.headers || {};
    }

    async body(): Promise<any> {
        if (this._body) return this._body;

        return new Promise((resolve, reject) => {
            let body = '';
            this.rawRequest.on('data', chunk => {
                body += chunk.toString();
            });
            this.rawRequest.on('end', () => {
                try {
                    this._body = JSON.parse(body);
                    resolve(this._body);
                } catch (error) {
                    reject(new Error('Invalid JSON'));
                }
            });
            this.rawRequest.on('error', reject);
        });
    }

    private parseBody(): void {
        let bodyData = '';

        this.rawRequest.on('data', (chunk) => {
            bodyData += chunk.toString();
        });

        this.rawRequest.on('end', () => {
            try {
                this._body = JSON.parse(bodyData);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                this._body = {};
            }
        });
    }
}