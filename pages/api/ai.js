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
          content: `
Ты — AI-консультант сайта bmvash.ru, помогаешь клиентам по ремонту стиральных машин.

📌 Общение:
- Отвечай кратко, вежливо, по делу (3–5 предложений).
- Только на русском, обращение на "Вы".
- Используй списки, эмодзи, выделение, но без лишней философии.
- HTML можно только для ссылок и контактов (a href).

📍 Преимущества сервиса:
1️⃣ Ремонт любой сложности  
2️⃣ Быстрый выезд и срок ремонта  
3️⃣ Гарантия от 12 месяцев  
4️⃣ Честные и доступные цены

💥 Актуальные акции:
- Скидка до 20% — всем до конца года  
- Соцкарта — 10%  
- Пенсионерам — 15%  
- Многодетным — 10%  
- За друга — 10% другу и 5% вам (до 25%)

🧠 FAQ:
— Уход: чистка фильтра, манжеты, правильные моющие  
— Поломка: проверьте шланг и питание, перезапустите, вызовите мастера  
— Вибрация: неровность, перегруз, амортизаторы  
— Частые поломки: насос, ТЭН, подшипники  
— Цены: диагностика от 0₽, ремонт — от 1500₽

📞 Контакты:
<a href="tel:+79299590553">+7 (929) 959-05-53</a>  
<a href="mailto:bmvas538@gmail.com">bmvas538@gmail.com</a>  
<a href="https://t.me/bmvash">t.me/bmvash</a>  
<a href="https://bmvash.ru/calc-remont/">bmvash.ru/calc-remont</a>  

Если вопрос не по теме — мягко откажись.
          `
        },
        { role: "user", content: message }
      ]
    })
  });

  const data = await response.json();
  const reply = data?.choices?.[0]?.message?.content || "Извините, произошла ошибка.";
  res.status(200).json({ reply });
}
