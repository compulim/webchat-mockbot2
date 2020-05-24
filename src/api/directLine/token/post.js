import generateDirectLineToken from '../../../utils/generateDirectLineToken';
import renewDirectLineToken from '../../../utils/renewDirectLineToken';
import trustedOrigin from '../../../trustedOrigin';

const ALLOW_ALL_HEADER = { 'Access-Control-Allow-Origin': '*' };

export default function postDirectLineToken(server, { env: { DIRECT_LINE_SECRET: directLineSecret } }) {
  if (!directLineSecret) {
    throw new TypeError('Environment variable "DIRECT_LINE_SECRET" must be set.');
  }

  server.post('/directline/token', async (req, res) => {
    const origin = req.header('origin');

    if (!trustedOrigin(origin)) {
      return res.send(403, 'not trusted origin');
    }

    const { token } = req.query;

    try {
      if (token) {
        res.send(await renewDirectLineToken(token), ALLOW_ALL_HEADER);
      } else {
        res.send(await generateDirectLineToken(directLineSecret), ALLOW_ALL_HEADER);
      }
    } catch (err) {
      res.send(500, err.message, ALLOW_ALL_HEADER);
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
