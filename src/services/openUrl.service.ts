import fetch from "node-fetch";
export async function openurl(driver: any, url: any) {
    try {
        console.log(url)
        const response =await fetch(url);    
        if (response.status == 200) {
            driver.get(url);
            return true;
        }
        else {            
            return false
        }
    }
    catch (e) {
        console.log('err >',e)
        return false;
    }
}