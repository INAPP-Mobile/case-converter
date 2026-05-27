import { test, expect } from "@playwright/test";

test.describe("Case Converter — E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("page loads with correct title", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Case Converter");
  });

  test("typing text shows camelCase result", async ({ page }) => {
    await page.locator("textarea").fill("hello world");
    await expect(page.getByText("helloWorld", { exact: true }).first()).toBeVisible({ timeout: 5000 });
  });

  test('typing "hello world" shows snake_case as "hello_world"', async ({ page }) => {
    await page.locator("textarea").fill("hello world");
    await expect(page.getByText("hello_world", { exact: true })).toBeVisible({ timeout: 5000 });
  });

  test('typing "hello world" shows kebab-case as "hello-world"', async ({ page }) => {
    await page.locator("textarea").fill("hello world");
    await expect(page.getByText("hello-world", { exact: true })).toBeVisible({ timeout: 5000 });
  });

  test('typing "hello world" shows PascalCase as "HelloWorld"', async ({ page }) => {
    await page.locator("textarea").fill("hello world");
    await expect(page.getByText("HelloWorld", { exact: true })).toBeVisible({ timeout: 5000 });
  });

  test('typing "hello world" shows UPPER CASE', async ({ page }) => {
    await page.locator("textarea").fill("hello world");
    await expect(page.getByText("HELLO WORLD", { exact: true }).first()).toBeVisible({ timeout: 5000 });
  });

  test('typing "hello world" shows lower case (when input contains some caps)', async ({ page }) => {
    await page.locator("textarea").fill("Hello World");
    await expect(page.getByText("hello world", { exact: true }).first()).toBeVisible({ timeout: 5000 });
  });

  test('typing "hello world" shows Title Case', async ({ page }) => {
    await page.locator("textarea").fill("hello world");
    await expect(page.getByText("Hello World", { exact: true })).toBeVisible({ timeout: 5000 });
  });

  test("copy button copies a specific case result", async ({ page }) => {
    await page.locator("textarea").fill("hello world");
    await page.evaluate(() => {
      navigator.clipboard.writeText = () => Promise.resolve();
    });
    const copyButtons = page.locator("button", { hasText: "Copy" });
    await expect(copyButtons.first()).toBeVisible({ timeout: 5000 });
    await copyButtons.first().click();
  });

  test("clear button clears input and results", async ({ page }) => {
    await page.locator("textarea").fill("hello world");
    await expect(page.getByText("helloWorld", { exact: true }).first()).toBeVisible({ timeout: 5000 });

    await page.getByRole("button", { name: "Clear", exact: true }).click();
    await expect(page.locator("textarea")).toHaveValue("");
    await expect(page.getByText("helloWorld", { exact: true }).first()).not.toBeVisible();
  });

  test("paste button is visible", async ({ page }) => {
    const pasteButton = page.locator("button", { hasText: "Paste" });
    await expect(pasteButton).toBeVisible();
  });

  test("word and character counts are shown", async ({ page }) => {
    await page.locator("textarea").fill("hello world");
    await expect(page.getByText("11 characters", { exact: true })).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("2 words", { exact: true })).toBeVisible({ timeout: 5000 });
  });

  test.describe("History feature", () => {
    test.beforeEach(async ({ page }) => {
      await page.evaluate(() => localStorage.clear());
      await page.reload();
    });

    test("after typing, history entry appears with CASE badge", async ({ page }) => {
      await page.locator("textarea").fill("hello world");
      await expect(page.getByText("helloWorld", { exact: true }).first()).toBeVisible({ timeout: 5000 });

      await expect(page.getByText("No history yet", { exact: true })).not.toBeVisible();
      await expect(page.getByText("CASE", { exact: true })).toBeVisible({ timeout: 5000 });
    });

    test("pin entry and verify star", async ({ page }) => {
      await page.locator("textarea").fill("hello world");
      await expect(page.getByText("helloWorld", { exact: true }).first()).toBeVisible({ timeout: 5000 });
      await expect(page.getByText("CASE", { exact: true })).toBeVisible({ timeout: 5000 });

      const pinButton = page.locator('button[title="Pin"]').first();
      await pinButton.click();

      await expect(page.locator('button[title="Unpin"]').first()).toBeVisible({ timeout: 3000 });
    });

    test("click history entry loads text back", async ({ page }) => {
      await page.locator("textarea").fill("hello world");
      await expect(page.getByText("helloWorld", { exact: true }).first()).toBeVisible({ timeout: 5000 });
      await expect(page.getByText("CASE", { exact: true })).toBeVisible({ timeout: 5000 });

      await page.getByRole("button", { name: "Clear", exact: true }).click();
      await expect(page.locator("textarea")).toHaveValue("");

      await page.locator("div.cursor-pointer").filter({ hasText: "hello world" }).first().click();
      await expect(page.locator("textarea")).toHaveValue("hello world");
    });

    test("delete entry removes it", async ({ page }) => {
      await page.locator("textarea").fill("hello world");
      await expect(page.getByText("helloWorld", { exact: true }).first()).toBeVisible({ timeout: 5000 });
      await expect(page.getByText("CASE", { exact: true })).toBeVisible({ timeout: 5000 });

      await page.locator('button[title="Delete"]').first().click({ force: true });
      await expect(page.getByText("No history yet", { exact: true })).toBeVisible({ timeout: 5000 });
    });

    test("clear all removes all entries", async ({ page }) => {
      await page.locator("textarea").fill("hello world");
      await expect(page.getByText("helloWorld", { exact: true }).first()).toBeVisible({ timeout: 5000 });
      await expect(page.getByText("CASE", { exact: true })).toBeVisible({ timeout: 5000 });

      await page.locator("textarea").fill("foo bar");
      await expect(page.getByText("fooBar", { exact: true }).first()).toBeVisible({ timeout: 5000 });

      const entriesBefore = await page.getByText("CASE", { exact: true }).count();
      expect(entriesBefore).toBeGreaterThanOrEqual(2);

      await page.locator("button", { hasText: "Clear All" }).click();
      await expect(page.getByText("No history yet", { exact: true })).toBeVisible({ timeout: 5000 });
    });
  });
});
