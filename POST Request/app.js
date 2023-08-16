const express = require('express');
const app = express();
const PORT = 4000;

app.use(express.json());

app.post('/', (req, res) => {
  const payload = req.body;

  if (!payload || !payload.str) {
    return res.status(400).send('Bad Request: Payload is missing or invalid.');
  }

  const wordCount = (payload.str.match(/\S+/g) || []).length;

  if (wordCount >= 8) {
    return res.status(200).send('OK');
  } else {
    return res.status(406).send('Not Acceptable: The input does not have at least 8 words.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
