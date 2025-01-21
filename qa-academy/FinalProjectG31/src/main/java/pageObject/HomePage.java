package pageObject;

import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class HomePage extends BasePage {
    WebDriverWait wait;


    public HomePage(WebDriverWait wait) {
        super(wait);
        this.wait = wait;
    }

    By CategoriesPage = By.cssSelector("li#menu-item-170");


    public void clickOnCategoriesPage (){
        wait.until(ExpectedConditions.elementToBeClickable(CategoriesPage)).click();
    }

}
