const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Pour autoriser les requêtes depuis votre site
const app = express();
const port = 3000;

// --- VOS INFORMATIONS À REMPLIR ---
const clientId = '1438960199397277728';
// !!! TRÈS IMPORTANT : METTEZ VOTRE VRAI CLIENT SECRET ICI !!!
const clientSecret = 'mvSUnpukxvVgXFGx3VrXA6PLBnE4PfAI';
const redirectUri = 'https://youcto77.github.io/Vlenz/'; 
// ------------------------------------

app.use(cors()); // Active CORS pour toutes les routes
app.use(express.json()); // Pour pouvoir lire le JSON envoyé par le client

// Route que votre page web va appeler pour échanger le code
app.post('/exchange_code', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'Code manquant.' });
    }

    try {
        // 1. Échanger le code contre un jeton d'accès
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token',
            new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectUri,
            }), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });

        const accessToken = tokenResponse.data.access_token;

        // 2. Obtenir les infos de l'utilisateur avec le jeton
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: { authorization: `Bearer ${accessToken}` },
        });
        
        // 3. Renvoyer les infos de l'utilisateur à la page web
        res.json(userResponse.data);

    } catch (error) {
        console.error("Erreur d'authentification:", error);
        res.status(500).json({ error: 'Erreur lors de l\'authentification avec Discord.' });
    }
});

app.listen(port, () => {
    console.log(`Serveur d'authentification démarré sur http://localhost:${port}`);
});