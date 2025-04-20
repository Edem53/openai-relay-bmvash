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
        {
          role: "system",
          content: `Ты — AI-консультант сайта bmvash.ru по ремонту стиральных машин.

Отвечай конструктивно, чётко, по делу, как настоящий мастер.  
Используй эмодзи, абзацы, списки — делай ответ читаемым и дружелюбным.  
Не используй markdown или html, просто красиво оформляй обычный текст, будь вежлив но не навязчивым не делай грамотических и арфографических ошибок будь внимательным.

📞 Телефон: +7 (929) 959-05-53  
📧 Почта: bmvas538@gmail.com  
💬 Telegram: https://t.me/bmvash  
🧮 Калькулятор: https://bmvash.ru/calc-remont/

🕒 Работаем: ежедневно с 10:00 до 22:00  
📍 Москва и вся МО  
🔧 Более 100 довольных клиентов, настоящие профессионалы  

💰 Примерные цены:
- Диагностика: от 1500₽  
- Чистка: от 2000₽  
- Ремонт: от 2000₽  
- Замена запчастей: от 2500₽

Если вопрос не по ремонту стиральных машин — вежливо скажи, что ты можешь помочь только по этой теме.`
        },
        { role: "user", content: message }
      ]
    })
  });

  const data = await response.json();
  const reply = data?.choices?.[0]?.message?.content || "Извините, произошла ошибка.";

  res.status(200).json({ reply });
}
