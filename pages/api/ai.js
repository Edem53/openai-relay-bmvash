export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { message } = req.body;
  const apiKey = process.env.GROQ_API_KEY;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: "Ты помощник сайта bmvash.ru по ремонту стиральных машин. Отвечай коротко, понятно, дружелюбно. Направляй на заявку и номер +7 (999) 999-99-99." },
        { role: "user", content: message }
      ]
    })
  });

  const data = await response.json();
  const reply = data?.choices?.[0]?.message?.content || "Извините, произошла ошибка.";

  res.status(200).json({ reply });
}
