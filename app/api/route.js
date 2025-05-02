export async function POST(request) {
  const { target, password, command, data } = await request.json();

  // Validasi input
  if (!target || !password) {
    return Response.json({ status: 'error', message: 'Target dan password diperlukan' });
  }

  try {
    const response = await fetch(`http://${target}/api/control`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, command, ...data })
    });

    return Response.json(await response.json());
  } catch (error) {
    return Response.json({ 
      status: 'error', 
      message: 'Gagal terhubung ke device target',
      debug: error.message 
    });
  }
}
