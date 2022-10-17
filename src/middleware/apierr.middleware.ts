class apierr {
   
    code: number;
    message: string;
    constructor(code: number, message: string) {
        this.code = code;
        this.message = message;
    }
    static badReq(msg: string) {
        return new apierr(400, msg);
    }
    static internal(msg: string) {
        return new apierr(500, msg);
    }
    
}
export default apierr;
