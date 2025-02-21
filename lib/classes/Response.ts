import {ServerResponse} from "http";
import * as fs from "fs";
import * as mime from "mime-types";

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

    sendFile(filePath: string) {
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                if (!this.rawResponse.writableEnded) {
                    this.statusCode = 404;
                    this.send('File not found');
                }
                return; // Retourner pour éviter toute tentative de réponse supplémentaire
            }

            const contentType = mime.lookup(filePath) || 'application/octet-stream';
            this.setHeader('Content-Type', contentType);

            const stream = fs.createReadStream(filePath);
            stream.pipe(this.rawResponse);

            stream.on('error', (error) => {
                if (!this.rawResponse.writableEnded) { // Vérifie si la réponse n'a pas déjà été envoyée
                    this.statusCode = 500;
                    this.send('Internal server error');
                }
            });

            // Assurez-vous de ne pas envoyer deux réponses pour une même requête
            stream.on('close', () => {
                if (!this.rawResponse.writableEnded) {
                    this.rawResponse.end();
                }
            });
        });
    }
}
