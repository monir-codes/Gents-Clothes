async function test() {
  try {
    const res = await fetch('https://gents-clothes-server.vercel.app/api/users/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Monir',
        email: 'mdrummanmondal2@gmail.com'
      })
    });
    console.log('Status:', res.status);
    const data = await res.text();
    console.log('Data:', data);
  } catch (err) {
    console.log('Error:', err);
  }
}

test();
