// Fichier : netlify/functions/coach.js

// On importe la bibliothèque node-fetch
const fetch = require('node-fetch');

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
        console.error("Erreur critique: La variable d'environnement DEEPSEEK_API_KEY n'est pas définie.");
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Configuration du serveur incomplète." })
        };
    }

    try {
        const { conversationHistory } = JSON.parse(event.body);

        if (!conversationHistory) {
            return { statusCode: 400, body: JSON.stringify({ error: "L'historique de la conversation est manquant." }) };
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

        // Gestion améliorée des erreurs de l'API externe
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Erreur de l'API DeepSeek (${response.status}):`, errorText);
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: `L'API du coach a retourné une erreur: ${response.statusText}` })
            };
        }

        const data = await response.json();
        const botReply = data.choices[0].message.content;

        return {
            statusCode: 200,
            body: JSON.stringify({ reply: botReply })
        };

    } catch (error) {
        console.error('Erreur inattendue dans la fonction coach:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Une erreur interne est survenue.' })
        };
    }
};