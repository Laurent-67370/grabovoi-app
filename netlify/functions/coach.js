// Fichier : netlify/functions/coach.js

exports.handler = async function (event, context) {
    // On vérifie que la requête est une requête POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { conversationHistory } = JSON.parse(event.body);
        const apiKey = process.env.DEEPSEEK_API_KEY; // Récupère la clé depuis les variables d'environnement Netlify

        if (!apiKey) {
            throw new Error("La clé API n'est pas configurée sur le serveur.");
        }

        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: conversationHistory,
                max_tokens: 1024,
                temperature: 0.7,
            })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Erreur de l\'API DeepSeek:', errorBody);
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: `Erreur de l'API externe: ${response.statusText}` })
            };
        }

        const data = await response.json();
        const botReply = data.choices[0].message.content;

        return {
            statusCode: 200,
            body: JSON.stringify({ reply: botReply })
        };

    } catch (error) {
        console.error('Erreur dans la fonction Netlify:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erreur interne du serveur.' })
        };
    }
};
