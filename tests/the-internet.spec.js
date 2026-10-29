const { test, expect } = require('@playwright/test');

test('Тексты главной страницы и переход к форме входа', async ({ page }) => {
  await test.step('1. Открыть главную страницу и проверить заголовок', async () => {
    await page.goto('/');
    await expect(page).toHaveTitle('The Internet');
    await expect(page.getByRole('heading', { name: 'Welcome to the-internet' })).toBeVisible();
  });
  await test.step('2. Проверить текст и ссылки на примеры', async () => {
    await expect(page.getByRole('heading', { name: 'Available Examples' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Form Authentication', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Checkboxes', exact: true })).toBeVisible();
  });
  await test.step('3. Перейти по ссылке и проверить новую страницу', async () => {
    await page.getByRole('link', { name: 'Form Authentication', exact: true }).click();
    await expect(page).toHaveURL('https://the-internet.herokuapp.com/login');
    await expect(page.getByRole('heading', { name: 'Login Page' })).toBeVisible();
    await expect(page.getByLabel('Username')).toBeVisible();
  });
});

test('Интерактивные элементы: переключение флажков', async ({ page }) => {
  await test.step('1. Перейти с главной страницы к флажкам', async () => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Checkboxes', exact: true }).click();
    await expect(page).toHaveURL('https://the-internet.herokuapp.com/checkboxes');
    await expect(page.getByRole('heading', { name: 'Checkboxes' })).toBeVisible();
    await expect(page.getByRole('checkbox')).toHaveCount(2);
  });
  await test.step('2. Включить первый флажок', async () => {
    const first = page.getByRole('checkbox').nth(0);
    await expect(first).not.toBeChecked();
    await first.check();
    await expect(first).toBeChecked();
  });
  await test.step('3. Выключить второй флажок', async () => {
    const second = page.getByRole('checkbox').nth(1);
    await expect(second).toBeChecked();
    await second.uncheck();
    await expect(second).not.toBeChecked();
  });
});

test('Форма: успешный вход и выход из защищённой страницы', async ({ page }) => {
  await test.step('1. Перейти к форме входа', async () => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Form Authentication', exact: true }).click();
    await expect(page).toHaveURL('https://the-internet.herokuapp.com/login');
    await expect(page.getByRole('heading', { name: 'Login Page' })).toBeVisible();
  });
  await test.step('2. Заполнить поля и отправить форму', async () => {
    // Общедоступные учебные данные указаны на самой странице /login.
    await page.getByLabel('Username').fill('tomsmith');
    await page.getByLabel('Password').fill('SuperSecretPassword!');
    await expect(page.getByLabel('Username')).toHaveValue('tomsmith');
    await expect(page.getByLabel('Password')).toHaveValue('SuperSecretPassword!');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('https://the-internet.herokuapp.com/secure');
    await expect(page.getByRole('heading', { name: 'Secure Area', exact: true })).toBeVisible();
    await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
  });
  await test.step('3. Выйти и проверить возврат на страницу входа', async () => {
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page).toHaveURL('https://the-internet.herokuapp.com/login');
    await expect(page.getByRole('heading', { name: 'Login Page' })).toBeVisible();
    await expect(page.locator('#flash')).toContainText('You logged out of the secure area!');
  });
});
