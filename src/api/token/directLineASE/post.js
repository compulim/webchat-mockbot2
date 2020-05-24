import generateDirectLineToken from '../../../utils/generateDirectLineToken';
import renewDirectLineToken from '../../../utils/renewDirectLineToken';
import trustedOrigin from '../../../trustedOrigin';

export default function postTokenDirectLineASE(
  server,
  { env: { DIRECT_LINE_SECRET: directLineSecret, WEBSITE_HOSTNAME: webSiteHostName } }
) {
  if (!directLineSecret) {
    throw new TypeError('Environment variable "DIRECT_LINE_SECRET" must be set.');
  }

  server.post('/api/token/directlinease', async (req, res) => {
    if (!webSiteHostName) {
      return res.send(500, 'only available on azure', { 'Access-Control-Allow-Origin': '*' });
    }

    const origin = req.header('origin');

    if (!trustedOrigin(origin)) {
      return res.send(403, 'not trusted origin', { 'Access-Control-Allow-Origin': '*' });
    }

    const { token } = req.query;

    try {
      const result = await (token
        ? renewDirectLineToken(token, { domain: `https://${webSiteHostName}/.bot/` })
        : generateDirectLineToken(directLineSecret, { domain: `https://${webSiteHostName}/.bot/` }));

      res.sendRaw(JSON.stringify(result, null, 2), {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      });
    } catch (err) {
      res.send(500, err.message, { 'Access-Control-Allow-Origin': origin });
    }

    if (token) {
      console.log(`Refreshing Direct Line token for ${origin}`);
    } else {
      console.log(
        `Requesting Direct Line token for ${origin} using secret "${directLineSecret.substr(
          0,
          3
        )}...${directLineSecret.substr(-3)}"`
      );
    }
  });
}
