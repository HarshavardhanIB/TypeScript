export async function validateImg(data: any, inputData: any) {
    let misc=inputData["misc"];
    let src = await data.getAttribute("src");
    let width = await data.getAttribute("naturalWidth");
    let height = await data.getAttribute("naturalHeight")
    if (src != inputData.src && width != misc.width && src != misc.height) {
        return false;
    }
    return true;
}