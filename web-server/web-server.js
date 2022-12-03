import express from 'express';
import * as path from 'path';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const app = express();
const PORT = 3001;
app.use(express.static(path.join(__dirname, '../public')));


app.listen(PORT, function(err){
	if (err) console.log(err);
	console.log('Server listening on PORT', PORT);
});