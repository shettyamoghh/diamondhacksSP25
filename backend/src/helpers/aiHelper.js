const fetch = require('node-fetch');

exports.callAIForRoadmap = async function (prompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.7
    })
  });

  const data = await response.json();

  if (data.error) {
    console.error("OpenAI API Error:", data.error);
    throw new Error(data.error.message || 'Error from OpenAI API');
  }

  if (!data.choices || !data.choices[0]) {
    console.error("Invalid response structure from OpenAI:", data);
    throw new Error("Invalid response from OpenAI API");
  }

  return data.choices[0].message.content.trim();
};
