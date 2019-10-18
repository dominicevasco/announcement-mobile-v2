export class Broadcast {
    private _id: number;
    private _startDate: any;
    private _expDate: any;
    private _posts: any[];
    private _note: string;
    private _interval: any;

    public get interval(): any {
        return this._interval;
    }
    public set interval(interval: any) {
        this._interval = interval;
    }

    public get note(): string {
        return this._note;
    }
    public set note(note: string) {
        this._note = note;
    }

    public get id(): number {
        return this._id;
    }
    public set id(id: number) {
        this._id = id;
    }

    public get expDate(): any {
        return this._expDate;
    }
    public set expDate(expDate: any) {
        this._expDate = expDate;
    }

    public set posts(posts: any[]) {
        this._posts = posts;
    }
    public get posts(): any[] {
        return this._posts;
    }

    public get startDate(): any {
        return this._startDate;
    }
    public set startDate(startDate: any) {
        this._startDate = startDate;
    }
}