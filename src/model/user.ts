export class User {
    private _id;
    private _photo;
    private _fname;
    private _lname;
    private _mname;
    private _gender;
    private _email;

    private _username;
    private _password;

    public get id() {
        return this._id;
    }
    public set id(id) {
        this._id = id;
    }
    public get username() {
        return this._username;
    }
    public set username(username) {
        this._username = username;
    }
    public get password() {
        return this._password;
    }
    public set password(password) {
        this._password = password;
    }
    public get gender() {
        return this._gender;
    }
    public set gender(gender) {
        this._gender = gender;
    }
    public get mname() {
        return this._mname;
    }
    public set mname(mname) {
        this._mname = mname;
    }
    public get lname() {
        return this._lname;
    }
    public set lname(lname) {
        this._lname = lname;
    }
    public get fname() {
        return this._fname;
    }
    public set fname(fname) {
        this._fname = fname;
    }
    public get email() {
        return this._email;
    }
    public set email(email) {
        this._email = email;
    }
    public get photo() {
        return this._photo;
    }
    public set photo(photo) {
        this._photo = photo;
    }
}
