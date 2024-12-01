from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from colorama import init, Fore, Style

# Initialize colorama
init(autoreset=True)

# Set up the webdriver (assuming Chrome is being used)
driver = webdriver.Chrome()

# Open the login page
driver.get('http://localhost:3000')

# Function to perform a login attempt
def attempt_login(username, password):
    username_field = driver.find_element(By.ID, "user")
    password_field = driver.find_element(By.ID, "pwd")
    username_field.clear()
    password_field.clear()
    username_field.send_keys(username)
    password_field.send_keys(password)
    password_field.send_keys(Keys.RETURN)
    time.sleep(2)

# Function to register a new user
def attempt_registration(username):
    username_field = driver.find_element(By.ID, "user")
    username_field.clear()
    username_field.send_keys(username)
    register_button = driver.find_element(By.XPATH, "//button[text()='Register']")
    register_button.click()
    time.sleep(2)
    alert = driver.switch_to.alert
    alert.send_keys("newpassword")
    alert.accept()

# Store test results
test_results = []


# Test 2: Failed login with incorrect password
print("Test2:")
attempt_login('kpeddakotla123', 'wrongPassword')
try:
    alert = driver.switch_to.alert
    if alert.text == 'Incorrect username or password':
        test_results.append(('Test 2: Failed login (incorrect password)', 'PASS'))
    alert.accept()
except:
    test_results.append(('Test 2: Failed login (incorrect password)', 'FAIL'))

# Test 3: Failed login with non-existing username
print("Test3:")
attempt_login('nonExistingUser', 'anyPassword')
try:
    alert = driver.switch_to.alert
    if alert.text == 'Incorrect username or password':
        test_results.append(('Test 3: Failed login (non-existing user)', 'PASS'))
    alert.accept()
except:
    test_results.append(('Test 3: Failed login (non-existing user)', 'FAIL'))

# Test 4: Empty login fields
print("Test4:")
attempt_login('', '')
try:
    alert = driver.switch_to.alert
    if alert.text == 'Please enter username and password':
        test_results.append(('Test 4: Empty login fields', 'PASS'))
    alert.accept()
except:
    test_results.append(('Test 4: Empty login fields', 'FAIL'))

# # Test 5: Successful login with valid credentials
print("Test 5: Successful login with valid credentials")
attempt_login('demo', 'demo')

try:
    # Wait for the dashboard element to be present
    dashboard_element = WebDriverWait(driver, 40).until(
        EC.presence_of_element_located((By.ID, 'dashboard'))
    )
    print(driver.current_url)  # Debugging statement
    if driver.current_url == 'http://localhost:3000/dashboard':
        test_results.append(('Test 5: Successful login', 'PASS'))
    else:
        test_results.append(('Test 5: Successful login', 'FAIL'))
except Exception as e:
    print(f"Exception: {e}")  # Debugging statement
    test_results.append(('Test 5: Successful login', 'FAIL'))

# Close the browser after all tests
driver.quit()

# Output results with colored formatting
for test_name, result in test_results:
    if result == 'PASS':
        print(f"{test_name}: {Fore.GREEN}{result}{Style.RESET_ALL}")
    else:
        print(f"{test_name}: {Fore.RED}{result}{Style.RESET_ALL}")
