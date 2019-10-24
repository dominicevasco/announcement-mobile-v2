export class Post {
    private _id: number;
    private _dateAdded: any;
    private _authorId : any;
    private _author: any;
    private _content: any;
    private _fileData: any;
    private _authorPic: any;
    private _status: any;
    private _type : any;

    private _bookmarked : boolean;

    public get authorId(): number {
        return this._authorId;
    }

    public set authorId(authorId: number) {
        this._authorId = authorId;
    }

    public get bookmarked(): boolean {
        return this._bookmarked;
    }

    public set bookmarked(bookmarked: boolean) {
        this._bookmarked = bookmarked;
    }

    public get id(): number {
        return this._id;
    }

    public set id(id: number) {
        this._id = id;
    }

    public get type(): any {
        return this._type;
    }

    public set type(type: any) {
        this._type = type;
    }

    public get status(): any {
        return this._status;
    }

    public set status(status: any) {
        this._status = status;
    }


    public get authorPic(): any {
        return this._authorPic;
    }

    public set authorPic(authorPic: any) {
        this._authorPic = authorPic;
    }

    public get fileData() {
        return this._fileData;
    }
    public set fileData(fileData) {
        this._fileData = fileData;
    }

    public get content() {
        return this._content;
    }
    public set content(content) {
        this._content = content;
    }

    public get author() {
        return this._author;
    }
    public set author(author) {
        this._author = author;
    }

    public get dateAdded() {
        return this._dateAdded;
    }
    public set dateAdded(dateAdded) {
        this._dateAdded = dateAdded;
    }


}