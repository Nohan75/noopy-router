import {ServerResponse} from "node:http";

export class Response {
    private rawResponse: ServerResponse;
    private _statusCode: number = 200;
    private _body: any;

    constructor(rawResponse: ServerResponse) {
        this.rawResponse = rawResponse;
    }

    get statusCode(): number {
        return this._statusCode;
    }

    set statusCode(statusCode: number) {
        this._statusCode = statusCode;
    }

    get body(): any {
        return this._body;
    }

    set body(body: any) {
        this._body = body;
    }

    getRawResponse(): ServerResponse {
        return this.rawResponse;
    }

    setHeader(name: string, value: string): void {
        console.log('Setting header:', name, value);
        this.rawResponse.setHeader(name, value);
    }

    json(data: any): void {
        this.rawResponse.statusCode = this._statusCode;
        this.rawResponse.setHeader('Content-Type', 'application/json');
        this.rawResponse.end(JSON.stringify(data));
    }

    send(body: any): void {
        this.rawResponse.statusCode = this._statusCode;
        this.rawResponse.end(JSON.stringify(body));
    }
}