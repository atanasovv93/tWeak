package pageObject;

import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class BasePage {
    WebDriverWait wait;

    public BasePage(WebDriverWait wait) {
        this.wait = wait;
    }

    By bookWormLogo = By.cssSelector("a.header-logo-link");

    public void clickOnLogo(){
        wait.until(ExpectedConditions.elementToBeClickable(bookWormLogo)).click();
    }


}
