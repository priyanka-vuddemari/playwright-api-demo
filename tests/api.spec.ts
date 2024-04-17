import { test, expect } from '@playwright/test';


test('api get request', async ({ request }) => {

    const response = await request.get("https://reqres.in/api/users?page=2");
    expect(response.status()).toBe(200);

    const text = response.text();
    expect(text).toContain('Lindsay');
  });