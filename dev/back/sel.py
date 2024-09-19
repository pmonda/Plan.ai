from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
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

# Test 1: Correct login (existing user)
attempt_login('admin', 'test')
time.sleep(2)
if driver.current_url == 'http://localhost:3000/dashboard':
    test_results.append(('Test 1', 'PASS'))
else:
    test_results.append(('Test 1', 'FAIL'))

# Test 2: Incorrect login (wrong password)
attempt_login('admin', 'wrongpassword')
try:
    alert = driver.switch_to.alert
    if alert.text == 'Incorrect username or password':
        test_results.append(('Test 2', 'PASS'))
    alert.accept()
except:
    test_results.append(('Test 2', 'FAIL'))

# Test 3: Login with non-existing user
attempt_login('nonexistent', 'password')
try:
    alert = driver.switch_to.alert
    if alert.text == 'Incorrect username or password':
        test_results.append(('Test 3', 'PASS'))
    alert.accept()
except:
    test_results.append(('Test 3', 'FAIL'))

# Test 4: Empty login attempt
attempt_login('', '')
try:
    alert = driver.switch_to.alert
    if alert.text == 'Incorrect username or password':
        test_results.append(('Test 4', 'PASS'))
    alert.accept()
except:
    test_results.append(('Test 4', 'FAIL'))

# Test 5: Login with special characters in username
attempt_login('admin$', 'test')
try:
    alert = driver.switch_to.alert
    if alert.text == 'Incorrect username or password':
        test_results.append(('Test 5', 'PASS'))
    alert.accept()
except:
    test_results.append(('Test 5', 'FAIL'))

# Test 6: Successful registration of a new user
attempt_registration('newuser1')
if 'newuser1' in driver.page_source:
    test_results.append(('Test 6', 'PASS'))
else:
    test_results.append(('Test 6', 'FAIL'))

# Close the browser after all tests
driver.quit()

# Output results with colored formatting
for test_name, result in test_results:
    if result == 'PASS':
        print(f"{test_name}: {Fore.GREEN}{result}{Style.RESET_ALL}")
    else:
        print(f"{test_name}: {Fore.RED}{result}{Style.RESET_ALL}")
