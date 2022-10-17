import validator from 'validator';
import * as constants from './constants.services';
export async function emailvalidation(email:string) {
    let emailIdcheckStatus = validator.isEmail(email);
    return emailIdcheckStatus;
}
export async function AlphaNumberorNot(userName:string) {
    let userNameValidation = validator.isAlphanumeric(userName);
    return userNameValidation;
}
export async function isAlphaorNot(name:string)
{
    let validate = validator.isAlpha(name);
    return validate;
}
export async function lengthVerification(data:string, min:number, max:number) {
    if (data.length <= min || data.length >= max) {
        return false;
    }
}
export async function autogenerateKey(len:number) {
    let key = '';
    const charactersLength = constants.characters.length;
    for (let i = 0; i < len; i++) {
        key += constants.characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return key;
}
