import express from "npm:express@4.18.2";
import axios from "npm:axios@1.6.8";
import bodyParser from "npm:body-parser@1.20.2";


const BASE_URL = 'https://script.google.com/macros/s/AKfycbyaLyPo6_F_Shgza5Y8RWvjd94T99xBYQ2u_yuPqD9V-02HOliFqc5cX31UC9KsryBb/exec';
const TABLE = 'Users';

const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


const startTime: number = performance.now(); // Record the start time



app.get('/', async (req, res) => {
    const startTime = performance.now(); // Record the start time

    try {
        const response = await fetch('https://dummyjson.com/products');
        const data = await response.json();

        const products = data.products;
        const processingTime = performance.now() - startTime;

        res.send(`
            <html>
            <head>
                <title>Product List</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="https://cdn.simplecss.org/simple.css">
            </head>
            <body>
<h1>Welcome to simple Deno + Express</h1>
<p>In this project I want to learn basic REST API using DENO</p>
<nav>
<a href="/">home</a>
<a href="/products">products</a>
<a href="/users">users</a>
</nav>

<div>
<h2>Try counter with HTMX</h2>
  <h4 id="counter">counter: <span>0</span></h4>
  <button hx-get="/api/increment" hx-swap="innerHTML" hx-target="#counter">increment counter</button>
</div>

<div>
  <h2>Try submit data with HTMX</h2>
<form id="myForm" hx-post="/submit" hx-target="#response" style="max-width:300px;">
    <input type="text" id="username" name="username" placeholder="Username" required>
    <input type="email" id="email" name="email" placeholder="Email" required>
    <button type="submit" hx-swap="delete" hx-indicator="#loading">Submit</button>
    <div id="loading" class="htmx-indicator">Submitting...</div>
</form>
<div id="response"></div>
</div>



<script src="https://unpkg.com/htmx.org@1.9.10"
    integrity="sha384-D1Kt99CQMDuVetoL1lrYwg5t+9QdHe7NLX/SoJYkXDFfX37iInKRy5xLSi8nO7UC"
    crossorigin="anonymous"></script>

            </body>
            </html>
        `);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

let counter = 0;

app.get('/api/increment', (req, res) => {
  counter++;
  const updatedHTML = `<h4 id="counter">counter: <span>${counter}</span></h4>`;
   
  res.send(updatedHTML);
});


app.post('/submit', async (req, res) => {
  try {
    const lastId = await getLastId();
    const newId = lastId + 1;

    // const timestamp = Math.floor((Date.now() + Time.now()) / 1000);
    // const currentTime = formatDate(new Date());

    const data = {
      id: newId,
      username: req.body.username,
      email: req.body.email
      // timestamp
      // currentTime
    };
        // console.log(timestamp);

    const response = await axios.get(`${BASE_URL}?action=insert&table=${TABLE}&data=${encodeURIComponent(JSON.stringify(data))}`);

    res.send(`Data dengan <b>id</b> ${data.id} <b>${data.username}</b> berhasil diterima`);
  } catch (error) {
    console.error('Error submitting data:', error);
    res.status(500).json({ error: 'An error occurred while submitting data.' });
  }
});

async function getLastId() {
  const response = await axios.get(`${BASE_URL}?action=read&table=${TABLE}`);
  const data = response.data.data;
  const lastItem = data[data.length - 1];
  return lastItem ? lastItem.id : 0;
};



app.get('/products', async (req, res) => {
    const startTime = performance.now(); // Record the start time

    try {
        const response = await fetch('https://dummyjson.com/products');
        const data = await response.json();

        const products = data.products;
        const processingTime = performance.now() - startTime;

        res.send(`
            <html>
            <head>
                <title>Product List</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">

                <meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="https://cdn.simplecss.org/simple.css">
            </head>
            <body>
<nav>
<a href="/">home</a>
<a href="/products">products<a>
<a href="/users">users</a>
</nav>
                <h1>Product List</h1>
                <p>Terdapat ${products.length} produk. Data berhasil diproses dalam waktu: <strong>${processingTime} milliseconds</strong></p>
                <ol>
                    ${products.map(product => `<li>ID: ${product.id}, Title: ${product.title}, Price: ${product.price}<span> <a href="/product/${product.id}">detail produk</a></span></li>`).join('')} 
                </ol>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

app.get('/users', async (req, res) => {

const url = 'https://script.google.com/macros/s/AKfycbyaLyPo6_F_Shgza5Y8RWvjd94T99xBYQ2u_yuPqD9V-02HOliFqc5cX31UC9KsryBb/exec?action=read&table=Users';

    const startTime = performance.now(); // Record the start time

    try {
        const response = await fetch(url);
        const data = await response.json();
        // console.log(data.data);

        const datas = data.data;
        const processingTime = performance.now() - startTime;

        res.send(`
            <html>
            <head>
                <title>Appscript data</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="https://cdn.simplecss.org/simple.css">
            </head>
            <body>
<nav>
<a href="/">home</a>
<a href="/products">products</a>
<a href="/users">users</a>
</nav>
<h2>Appscript data</h2>
                <p>Terdapat ${datas.length} data. Data berhasil diproses dalam waktu: <strong>${processingTime} milliseconds</strong></p>
<table>
<tr>
<th>id</th>
<th>action</th>
</tr>
           ${datas.map(data => `
<tr>
            <td>${data.id} </td>
            <td><a href="/user/${data.id}">Detail</a> </td>
</tr>
`).join('')}
</table>

</body>
</html>
        `);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

app.get('/user/:id', async (req, res) => {

const url = 'https://script.google.com/macros/s/AKfycbyaLyPo6_F_Shgza5Y8RWvjd94T99xBYQ2u_yuPqD9V-02HOliFqc5cX31UC9KsryBb/exec?action=read&table=Users&id=';
    const startTime = performance.now(); // Record the start time

    try {
        const response = await fetch(url + req.params.id);
        const data = await response.json();
        // console.log(data.data);

        const datas = data.data;
        const processingTime = performance.now() - startTime;

        res.send(`
            <html>
            <head>
                <title>${datas.username} detail</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="https://cdn.simplecss.org/simple.css">
            </head>
            <body>
<nav>
<a href="/">home</a>
<a href="/products">products</a>
<a href="/users">users</a>
</nav>
<h2>${datas.username} detail</h2>


                <p>Data berhasil diproses dalam waktu: <strong>${processingTime} milliseconds</strong></p>

<table>
<tr>
<th>id</th>
<th>email</th>
<th>username</th>
</tr>
<tr>
            <td>${datas.id} </td>
            <td>${datas.email} </td>
            <td>${datas.username} </td>
</tr>
</table>

</body>
</html>
        `);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

app.get('/product/:id', async (req, res) => {

    try {
        const response = await fetch(`https://dummyjson.com/products/${req.params.id}`);
        const data = await response.json();
        // console.log(data);

        res.send(`
            <html>
            <head>
                <title>${data.title}</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="https://cdn.simplecss.org/simple.css">
            </head>
            <body>
<a href="/products">Back</a>
           <h2>${data.title}</h2>
            <img src='${data.thumbnail}'>
            <p>${data.description}</p>
            <p>Harga: $${data.price}</p>
            <p>Diskon: ${data.discountPercentage}%</p>
            <p>Rating: ${data.rating}</p>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});




app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});


