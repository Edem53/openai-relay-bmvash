export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { message } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Ты помощник сайта по ремонту стиралок bmvash.ru. Отвечай кратко, дружелюбно. Направляй на заявку или номер +7 (999) 999-99-99.' },
        { role: 'user', content: message || '' }
      ]
    })
  });

  const data = await openaiRes.json();
  const reply = data?.choices?.[0]?.message?.content || 'Извините, произошла ошибка.';

  return res.status(200).json({ reply });
}
// test redeploy
