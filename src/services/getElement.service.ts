import { Builder, Capabilities, By } from 'selenium-webdriver';
import * as webdriver from 'selenium-webdriver';
export async function getElement(driver: any, locatorType: any, locatorValue: any) {
    try {
        // console.log('locator value',locatorValue)
        let element: webdriver.WebElement;
        if (locatorType == "id") {
            element = await driver.findElement(By.id(locatorValue));
        }
        else if (locatorType == "class") {
            element = await driver.findElement(By.className(locatorValue));
        }
        else {
            element = await driver.findElement(By.xpath(locatorValue));
        }
        return element;
    }
    catch (e: any) {
        // // console.log("error in this ")
        return null;
    }
}