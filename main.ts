import express from 'npm:express@4.17';
import {dirname} from "https://deno.land/std/path/mod.ts";


const app = express();



app.use(express.static('/public'));
app.use(express.json());


app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

let counter = 0;


//app.get('/', async (req, res) => {
//  res.send('index.html')
  
//});


app.get('/', function (req, res, next) {
  var options = {
    root: path.join(dirname, 'public'),
  }

  var fileName = req.params.name
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err)
    } else {
      console.log('Sent:', fileName)
    }
  })
});




app.get('/api/increment', (_, res) => {
  counter++;
  const updatedHTML = `<h2 id="counter">counter: <span>${counter}</span></h2>`;
  res.send(updatedHTML);
});


const PORT = 3000;

app.listen(PORT);





