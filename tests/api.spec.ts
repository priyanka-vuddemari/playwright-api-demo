import { test, expect } from '@playwright/test';


test('api get request', async ({ request }) => {
  const response = await request.get("https://reqres.in/api/users?page=2");
  expect(response.status()).toBe(200);
  const text = response.text();
  // todo : need to check 
  //expect(text).toContain('Lindsay');
});

test('api post request', async ({ request }) => {
  const response = await request.post("https://reqres.in/api/users" , {
    data : {
      "name": "Priyanka",
      "job": "leader"
    }
  })
  expect(response.status()).toBe(201);

  })

  test('api put request', async ({ request }) => {
    const response = await request.put("https://reqres.in/api/users/2" , {
      data : {
        "name": "Priyanka",
        "job": "Software Engineer"
      }
    })
    expect(response.status()).toBe(201);
  
    })
    
test('api delete request', async ({ request }) => {
  const response = await request.delete("https://reqres.in/api/users/2");
  expect(response.status()).toBe(204);
});