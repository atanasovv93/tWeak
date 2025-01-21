package pageObject;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class WishListPage extends BasePage {
    WebDriverWait wait;
    WebDriver driver;

    public WishListPage(WebDriverWait wait, WebDriver driver) {
        super(wait);
        this.wait = wait;
        this.driver = driver;
    }

    By productInWishList = By.xpath("//td[@class='product-name']/a[contains(text(), 'The Last Sister (Columbia River Book 1)')]");
    By editTitleButton = By.cssSelector("a.btn.button.show-title-form");
    By titleInput = By.cssSelector("input[name='wishlist_name']");
    By saveTitleButton = By.cssSelector("a.save-title-form");

    public String getProductName() {
        wait.until(ExpectedConditions.visibilityOfElementLocated(productInWishList));
        return driver.findElement(productInWishList).getText();
    }

    public void editWishlistTitle(String newTitle) {
        wait.until(ExpectedConditions.elementToBeClickable(editTitleButton)).click();
        WebElement titleInputElement = wait.until(ExpectedConditions.visibilityOfElementLocated(titleInput));
        titleInputElement.clear();
        titleInputElement.sendKeys(newTitle);
        wait.until(ExpectedConditions.elementToBeClickable(saveTitleButton)).click();
    }
}
