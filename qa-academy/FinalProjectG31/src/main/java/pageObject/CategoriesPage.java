package pageObject;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.TimeoutException;

public class CategoriesPage extends BasePage {
    WebDriver driver;

    public CategoriesPage(WebDriverWait wait, WebDriver driver) {
        super(wait);
        this.driver = driver;
    }

    By theLastSisterBook = By.xpath("//h2//a[normalize-space(text())='The Last Sister (Columbia River Book 1)']");
    By addBookToWishlist = By.xpath("//a[@data-product-id='20']/span[text()='Add to wishlist']");
    By productAddedMessage = By.id("yith-wcwl-message");
    By wishlisticon = By.xpath("//li[@class='nav-item d-none d-md-block font-size-4']/a[@class='nav-link link-black-100 font-size-3 px-3']");

    // Task 2 locators using XPath
    By addToCartButton = By.xpath("//button[@name='add-to-cart' and @value='20']");
    By viewCartButton = By.xpath("//a[@class='button wc-forward' and text()='View cart']");
    By proceedToCheckoutButton = By.xpath("//a[contains(@class, 'checkout-button')]");

    public void addLastSisterBookToWishlist() {
        try {
            System.out.println("Attempting to click the last sister book.");
            WebElement theLastSisterBookElement = wait.until(ExpectedConditions.elementToBeClickable(theLastSisterBook));
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", theLastSisterBookElement);

            System.out.println("Attempting to move to and click the wishlist button.");
            Actions actions = new Actions(driver);
            actions.moveToElement(theLastSisterBookElement).perform();

            WebElement wishlistButton = wait.until(ExpectedConditions.visibilityOfElementLocated(addBookToWishlist));
            actions.moveToElement(wishlistButton).click().perform();

            System.out.println("Successfully added the book to the wishlist. Waiting for confirmation message.");

            // Wait for the "Product added!" message to appear
            wait.until(ExpectedConditions.visibilityOfElementLocated(productAddedMessage));
            System.out.println("Confirmation message displayed: Product added!");
        } catch (NoSuchElementException | TimeoutException e) {
            System.out.println("Element not found or not clickable: " + e.getMessage());
        }
    }

    public void clickOnWishlist() throws Exception {
        WebElement wishListElement = wait.until(ExpectedConditions.presenceOfElementLocated(wishlisticon));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", wishListElement);
        Thread.sleep(2000); // Consider using WebDriverWait instead of Thread.sleep
        wait.until(ExpectedConditions.elementToBeClickable(wishlisticon)).click();
    }

    // Task 2 methods
    public void addBookToCart() {
        try {
            WebElement bookElement = wait.until(ExpectedConditions.elementToBeClickable(theLastSisterBook));
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", bookElement);
            bookElement.click(); // Click the book first

            WebElement addToCartButtonElement = wait.until(ExpectedConditions.elementToBeClickable(addToCartButton));
            addToCartButtonElement.click(); // Then click the add to cart button
        } catch (NoSuchElementException | TimeoutException e) {
            System.out.println("Element not found or not clickable: " + e.getMessage());
        }
    }

    public void viewCart() {
        WebElement viewCartButtonElement = wait.until(ExpectedConditions.elementToBeClickable(viewCartButton));
        viewCartButtonElement.click();
    }

    public void proceedToCheckout() {
        try {
            WebElement proceedToCheckoutButtonElement = wait.until(ExpectedConditions.presenceOfElementLocated(proceedToCheckoutButton));
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", proceedToCheckoutButtonElement);
            proceedToCheckoutButtonElement.click();
        } catch (NoSuchElementException | TimeoutException e) {
            System.out.println("Element not found or not clickable: " + e.getMessage());
        }
    }
}
