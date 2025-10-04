import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import pageObject.CategoriesPage;
import pageObject.HomePage;
import pageObject.WishListPage;
import pageObject.CheckoutPage;
import org.testng.TestNG;

import java.time.Duration;

public class BookWormFinal {
     public static void main(String[] args) {
        TestNG testng = new TestNG();
        testng.setTestClasses(new Class[] { BookWormFinal.class });
        testng.run();
    }
    WebDriver driver;
    WebDriverWait wait;
    HomePage homePage;
    CategoriesPage categoriesPage;
    WishListPage wishListPage;
    CheckoutPage checkoutPage;

    @BeforeMethod
    public void setUp() throws Exception {
        driver = new ChromeDriver();
        Thread.sleep(3000);
        wait = new WebDriverWait(driver, Duration.ofSeconds(20));
        homePage = new HomePage(wait);
        categoriesPage = new CategoriesPage(wait, driver);
        wishListPage = new WishListPage(wait, driver);
        checkoutPage = new CheckoutPage(wait, driver);
        driver.manage().window().maximize();
        driver.get("https://bookworm.madrasthemes.com/");
    }

    @AfterMethod
    public void tearDown() {
        driver.quit();
    }

    @Test
    public void bookWormFinalProjectTest() throws Exception {
        homePage.clickOnCategoriesPage();
        categoriesPage.addLastSisterBookToWishlist();
        categoriesPage.clickOnWishlist();
        wishListPage.editWishlistTitle("My Fav Books");
        Assert.assertEquals(wishListPage.getProductName(), "The Last Sister (Columbia River Book 1)");
        Thread.sleep(4000);
    }

    @Test
    public void bookWormFinalProjectTest2() throws Exception {
        homePage.clickOnCategoriesPage();

        // Task 2 steps:
        // Step 3: Add a book to the cart
        categoriesPage.addBookToCart();

        // Step 4: View cart and proceed to Checkout
        categoriesPage.viewCart();
        categoriesPage.proceedToCheckout();

        // Step 5: Fill in the checkout form and place an order
        checkoutPage.fillCheckoutForm("John", "Doe", "", "California", "3747 Cemetery Street", "", "93901", "Salinas", "CA", "+1 831-718-9423", "johndoeusa56@gmail.com");
        checkoutPage.placeOrder();

        // Step 6: Validate that the order is successful
        String confirmationMessage = checkoutPage.getOrderConfirmationMessage();
        Assert.assertEquals(confirmationMessage, "Thank you. Your order has been received.", "Order confirmation message does not match!");
    }
}
