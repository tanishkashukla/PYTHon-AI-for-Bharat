const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { TranslateClient, TranslateTextCommand } = require("@aws-sdk/client-translate");
const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
const { PollyClient, SynthesizeSpeechCommand } = require("@aws-sdk/client-polly");
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");

const s3 = new S3Client();
const translate = new TranslateClient();
const bedrock = new BedrockRuntimeClient();
const polly = new PollyClient();
const dynamodb = new DynamoDBClient();

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const { session_id, language, message, selected_category } = body;

    try {
        // 1. Translation
        let englishMessage = message;
        if (language === 'hi') {
            const translateRes = await translate.send(new TranslateTextCommand({
                Text: message,
                SourceLanguageCode: 'hi',
                TargetLanguageCode: 'en'
            }));
            englishMessage = translateRes.TranslatedText;
        }

        // 2. Categorization (Simple Keyword Mapping for MVP)
        const category = selected_category || categorize(englishMessage);

        // 3. Fetch Context from S3
        const chunk = await getS3Chunk(category);

        // 4. Call Bedrock (Claude 3 Haiku)
        const bedrockResponse = await callBedrock(englishMessage, chunk);
        const structuredData = JSON.parse(bedrockResponse);

        // 5. Text to Speech (Polly)
        const audioUrl = await generateSpeech(structuredData.summary || structuredData.rights.join(' '), language);

        // 6. Save to DynamoDB
        await saveSession(session_id, message, structuredData);

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({
                ...structuredData,
                category,
                audio_url: audioUrl
            })
        };

    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" })
        };
    }
};

function categorize(text) {
    const map = {
        'consumer': ['product', 'refund', 'shop', 'buy', 'defective'],
        'property': ['house', 'rent', 'land', 'owner', 'flat'],
        'employment': ['salary', 'job', 'boss', 'work', 'fired'],
        // ... more mappings
    };
    // Logic to return category based on keywords
    return 'general';
}

async function getS3Chunk(category) {
    const command = new GetObjectCommand({
        Bucket: process.env.CHUNKS_BUCKET,
        Key: `chunks/${category}.json`
    });
    const res = await s3.send(command);
    return await res.Body.transformToString();
}

async function callBedrock(query, context) {
    const prompt = `
        You are KnowYourRightsAI, a legal awareness assistant for Indian citizens. 
        Respond ONLY in valid JSON.
        
        Format:
        {
          "rights": ["bullet 1", "bullet 2"],
          "steps": ["step 1", "step 2"],
          "authority": { "name": "Authority Name", "phone": "Phone", "website": "URL" },
          "disclaimer": "This is legal awareness only, not legal advice.",
          "article_cited": "Act Name, Section X"
        }

        Context: ${context}
        User Query: ${query}
    `;

    const command = new InvokeModelCommand({
        modelId: "anthropic.claude-3-haiku-20240307-v1:0",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 1000,
            messages: [{ role: "user", content: prompt }]
        })
    });

    const res = await bedrock.send(command);
    const resBody = JSON.parse(new TextDecoder().decode(res.body));
    return resBody.content[0].text;
}

async function generateSpeech(text, lang) {
    const command = new SynthesizeSpeechCommand({
        Text: text,
        OutputFormat: "mp3",
        VoiceId: lang === 'hi' ? "Aditi" : "Joanna"
    });
    const res = await polly.send(command);
    // In production, upload the stream to S3 and return a signed URL
    return "https://s3.amazonaws.com/bucket/audio.mp3"; 
}

async function saveSession(sessionId, message, response) {
    await dynamodb.send(new PutItemCommand({
        TableName: process.env.SESSIONS_TABLE,
        Item: marshall({
            session_id: sessionId,
            timestamp: Date.now(),
            user_message: message,
            ai_response: response
        })
    }));
}
