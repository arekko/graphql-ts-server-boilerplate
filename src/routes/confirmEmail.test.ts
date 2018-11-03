import fetch from "node-fetch";

test('send invalid back if bad id sent', async () => {
    const respose = await fetch(`${process.env.TEST_HOST}/confirm/1234`);
    const text = await respose.text();
    expect(text).toEqual("invalid");
  });
 