const fetch = require('node-fetch');

exports.callAItoGenerateTopics = async function (syllabusText) {
    const prompt = `
      Given the following syllabus text, split the syllabus into at least 20 different learning objectives about the course only, each with a title. Don't include things such as course guideline and understanding integrity and things like that, only the topics related to the class subject itself.

      Syllabus:
      ${syllabusText}

        Please provide them like this:

        Introduction to Formal Language 
        Understand the Concept of Automata
        Comprehend Turing Machines

    `;
  
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500
      })
    });
  
    const data = await response.json();
    
    // Log the full response for debugging
    console.log("OpenAI API response:", data);
  
    // Check for errors in the response
    if (data.error) {
      console.error("OpenAI API Error:", data.error);
      throw new Error(data.error.message || 'Error from OpenAI API');
    }
  
    if (!data.choices || !data.choices[0]) {
      console.error("Invalid response structure from OpenAI:", data);
      throw new Error("Invalid response from OpenAI API");
    }
  
    const completion = data.choices[0].message.content.trim();
    return completion;
  };
  