import express from 'npm:express@4.17';
//import path from 'npm:path@0.12.7';

import * as path from "https://deno.land/std@0.188.0/path/mod.ts";

const __filename = path.fromFileUrl(import.meta.url);
// Without trailing slash
const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

const app = express();


//app.use(express.static('public'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

let counter = 0;

app.get('/api/increment', (_, res) => {
  counter++;
  const updatedHTML = `<h2 id="counter">counter: <span>${counter}</span></h2>`;
  res.send(updatedHTML);
});


const PORT = 3000;

// app.listen(PORT, () => {
//     console.log(`server running on http://localhost:${PORT}`);
// }); 

app.listen(PORT);

// module.exports = app;




