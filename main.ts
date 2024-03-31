import express from 'npm:express@4.17';


import __ from 'https://deno.land/x/dirname/mod.ts';
const { __filename, __dirname } = __(import.meta);

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




