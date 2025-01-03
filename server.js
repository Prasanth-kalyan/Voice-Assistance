const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const port = 3000;

// OpenAI API Initialization
Configuration = new Configuration({
    apiKey: 's-proj-B4kLUwHX0mnB2OiqfxNmINw4hcZjwuyIVs-W24WFJ4fCUYEYLOXJpk_f57jKiGMv2zKqhbCHlsT3BlbkFJSfO8DnQzl2vpY0cSacgBhpfjxytCjSlcspI-hdlwm2x3uRdoAv7I0UUip1WLNTjE6Iu3qmcTMA', // Replace with your OpenAI API Key
});
const openai = new OpenAIApi(configuration);

// Middleware
app.use(express.static(path.join(__dirname))); // Serve static files like index.html
app.use(bodyParser.json());

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API Endpoint to process voice input and topic
app.post('/process', async(req, res) => {
    const { voiceInput, topic } = req.body;

    if (!voiceInput || !topic) {
        return res.status(400).json({ error: 'Voice input and topic are required.' });
    }

    try {
        // Generate a response using OpenAI API
        const response = await openai.createChatCompletion({
            model: 'gpt-4',
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: `Based on the voice input: "${voiceInput}", provide a detailed response on the topic: "${topic}".` },
            ],
        });

        const generatedText = response.data.choices[0].message.content.trim();
        res.json({ response: generatedText });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Failed to generate a response. Please try again.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});