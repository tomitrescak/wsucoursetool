import fs from 'fs';
import path from 'path';

export default (req, res) => {
  if (req.method === 'POST') {
    const book = req.body;
    const original = fs.readFileSync(path.resolve('./src/data/db.json'), {
      encoding: 'utf-8'
    });
    fs.writeFileSync(path.resolve(`./src/data/backup/db.${Date.now()}.json`), original, {
      encoding: 'utf-8'
    });

    // Output the book to the console for debugging
    fs.writeFileSync(path.resolve('./src/data/db.json'), JSON.stringify(book, null, 2), {
      encoding: 'utf-8'
    });
  }

  res.send('OK');
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};
