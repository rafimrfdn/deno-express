import express from 'npm:express@4.17';


const app = express();




app.use(express.static('/public'));
app.use(express.json());


app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

let counter = 0;


app.get('/', async (req, res) => {
  res.send('haloo')
  
});

app.get('/api/increment', (_, res) => {
  counter++;
  const updatedHTML = `<h2 id="counter">counter: <span>${counter}</span></h2>`;
  res.send(updatedHTML);
});


const PORT = 3000;

app.listen(PORT);





