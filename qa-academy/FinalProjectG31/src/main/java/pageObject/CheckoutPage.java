package pageObject;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class CheckoutPage extends BasePage {
    WebDriver driver;

    public CheckoutPage(WebDriverWait wait, WebDriver driver) {
        super(wait);
        this.driver = driver;
    }

    By firstName = By.id("billing_first_name");
    By lastName = By.id("billing_last_name");
    By companyName = By.id("billing_company");
    By country = By.id("billing_country");
    By address = By.id("billing_address_1");
    By address2 = By.id("billing_address_2");
    By postalCode = By.id("billing_postcode");
    By city = By.id("billing_city");
    By state = By.id("billing_state");
    By phone = By.id("billing_phone");
    By email = By.id("billing_email");
    By placeOrderButton = By.id("place_order");
    By orderSuccessMessage = By.xpath("//h6[contains(@class, 'woocommerce-notice--success') and contains(text(), 'Thank you. Your order has been received.')]");

    public void fillCheckoutForm(String fName, String lName, String comp, String cntry, String addr, String addr2, String postal, String cty, String st, String ph, String mail) {
        fillField(firstName, fName, "First Name");
        fillField(lastName, lName, "Last Name");
        fillField(companyName, comp, "Company Name");
        fillField(country, cntry, "Country");
        fillField(address, addr, "Address");
        fillField(address2, addr2, "Address 2");
        fillField(postalCode, postal, "Postal Code");
        fillField(city, cty, "City");
        fillField(state, st, "State");
        fillField(phone, ph, "Phone");
        fillField(email, mail, "Email");
    }

    private void fillField(By locator, String text, String fieldName) {
        try {
            WebElement element = wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
            element.clear();
            element.sendKeys(text);
            System.out.println("Successfully filled the " + fieldName + " field.");
        } catch (Exception e) {
            System.out.println("Failed to interact with the " + fieldName + " field: " + e.getMessage());
        }
    }

    public void placeOrder() {
        try {
            WebElement placeOrderButtonElement = wait.until(ExpectedConditions.elementToBeClickable(placeOrderButton));
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", placeOrderButtonElement);
            placeOrderButtonElement.click();
        } catch (Exception e) {
            System.out.println("Failed to place order: " + e.getMessage());
        }
    }

    public boolean isOrderSuccess() {
        try {
            WebElement successMessageElement = wait.until(ExpectedConditions.visibilityOfElementLocated(orderSuccessMessage));
            return successMessageElement.isDisplayed();
        } catch (Exception e) {
            System.out.println("Order success message not found: " + e.getMessage());
            return false;
        }
    }

    public String getOrderConfirmationMessage() {
        try {
            WebElement successMessageElement = wait.until(ExpectedConditions.visibilityOfElementLocated(orderSuccessMessage));
            return successMessageElement.getText();
        } catch (Exception e) {
            System.out.println("Order confirmation message not found: " + e.getMessage());
            return "";
        }
    }
}
