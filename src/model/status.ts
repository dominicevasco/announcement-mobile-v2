export class Status {
    private _code;
    private _message;

    public get code(): number {
        return this._code;
    }

    public set code(code: number) {
        this._code = code;
    }
    
    public get message(): any {
        return this._message;
    }

    public set message(_message: any) {
        this._message = _message;
    }
}