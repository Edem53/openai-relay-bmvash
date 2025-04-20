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
          content: `Ты — AI-консультант компании по ремонту стиральных машин bmvash.ru.
Отвечай кратко, вежливо, по делу, дружелюбным тоном. Направляй на заявку, телефон или калькулятор при необходимости.

📞 Телефон для связи: +7 (929) 959-05-53  
📧 Почта: bmvas538@gmail.com  
📆 Работаем ежедневно с 10:00 до 22:00  
📍 Обслуживаем всю Москву и МО  
📊 Калькулятор ремонта: https://bmvash.ru/calc-remont/  
💬 Telegram: https://t.me/bmvash  

🛠️ Услуги и цены:
- Диагностика: от 1500 руб  
- Чистка: от 2000 руб  
- Ремонт: от 2000 руб  
- Замена запчастей: от 2500 руб  

💡 Мы — молодая, но уверенная команда. Уже более 100 довольных клиентов и профессиональные мастера.

Если вопрос не по ремонту — скажи, что можешь только по ремонту и помочь по ссылке или телефону.`
        },
        { role: "user", content: message }
      ]
    })
  });

  const data = await response.json();
  const reply = data?.choices?.[0]?.message?.content || "Извините, произошла ошибка.";

  res.status(200).json({ reply });
}
