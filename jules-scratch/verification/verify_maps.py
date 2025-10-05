from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Listen for console events and print them
    page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))

    page.goto("http://localhost:3000")
    page.wait_for_timeout(5000) # Wait for 5 seconds to ensure maps have time to load
    page.screenshot(path="jules-scratch/verification/verification.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)