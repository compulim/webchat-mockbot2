import fetch from 'node-fetch';

import trustedOrigin from '../../../trustedOrigin';

export default async function postTokenSpeechServices(
  server,
  { env: { SPEECH_SERVICES_REGION, SPEECH_SERVICES_SUBSCRIPTION_KEY } }
) {
  server.post('/api/token/speechservices', async (req, res) => {
    if (!SPEECH_SERVICES_REGION || !SPEECH_SERVICES_SUBSCRIPTION_KEY) {
      return res.send(403, 'Cognitive Services Speech Services authorization token is unavailable.');
    }

    console.log(
      `Requesting Speech Services authorization token using subscription key "${SPEECH_SERVICES_SUBSCRIPTION_KEY.substr(
        0,
        3
      )}...${SPEECH_SERVICES_SUBSCRIPTION_KEY.substr(-3)}" for ${origin}`
    );

    const origin = req.header('origin');

    if (!trustedOrigin(origin)) {
      return res.send(403, 'not trusted origin', { 'Access-Control-Allow-Origin': origin });
    }

    const tokenRes = await fetch(`https://${SPEECH_SERVICES_REGION}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, {
      headers: { 'Ocp-Apim-Subscription-Key': SPEECH_SERVICES_SUBSCRIPTION_KEY },
      method: 'POST'
    });

    if (!tokenRes.ok) {
      return res.send(500, { 'Access-Control-Allow-Origin': origin });
    }

    const authorizationToken = await tokenRes.text();

    res.sendRaw(
      JSON.stringify(
        {
          authorizationToken,
          human: '"token" is being deprecated, use "authorizationToken" instead.',
          region: SPEECH_SERVICES_REGION,
          token: authorizationToken
        },
        null,
        2
      ),
      {
        'Access-Control-Allow-Origin': origin,
        'Content-Type': 'application/json'
      }
    );
  });
}
