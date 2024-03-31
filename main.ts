import express from 'npm:express@4.17';
// import path from 'npm:path@0.12.7';
import bodyParser from 'npm:body-parser@1.20.2';
import axios from 'npm:axios@1.6.8';

const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const BASE_URL = 'https://script.google.com/macros/s/AKfycbyaLyPo6_F_Shgza5Y8RWvjd94T99xBYQ2u_yuPqD9V-02HOliFqc5cX31UC9KsryBb/exec';
const TABLE = 'Users';

const INSERTDATA = `${BASE_URL}?action=insert&table=${TABLE}&data=`;
const READDATA = `${BASE_URL}?action=read&table=${TABLE}`;
const UPDATEDATA = `${BASE_URL}?action=update&table=${TABLE}&id=`;
const DELETEDATA = `${BASE_URL}?action=delete&table=${TABLE}&id=`;

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




app.post('/submit', async (req, res) => {
  try {
    const lastId = await getLastId();
    const newId = lastId + 1;

    // const timestamp = Math.floor((Date.now() + Time.now()) / 1000);
    // const currentTime = formatDate(new Date());

    const data = {
      id: newId,
      username: req.body.username,
      email: req.body.email,
      // timestamp
      // currentTime
    };
        // console.log(timestamp);

    // const response = await axios.get(`${BASE_URL}?action=insert&table=Users&data=${encodeURIComponent(JSON.stringify(data))}`);
    const res = await axios.get(`${INSERTDATA} + ${encodeURIComponent(JSON.stringify(data))}`);

    // res.send(`Data dengan <b>id</b> ${data.id} <b>${data.username}</b> berhasil diterima`);


  } catch (error) {
    console.error('Error submitting data:', error);
    res.status(500).json({ error: 'An error occurred while submitting data.' });
  }
});

async function getLastId() {
  const response = await axios.get(`${BASE_URL}?action=read&table=Users`);
  const data = response.data.data;
  const lastItem = data[data.length - 1];
  return lastItem ? lastItem.id : 0;
}

// function formatDate(date) {
//   const month = date.getMonth() + 1;
//   const day = date.getDate();
//   const year = date.getFullYear();
//   const hours = date.getHours();
//   const minutes = date.getMinutes();
//   const seconds = date.getSeconds();
//
//   return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
// }



app.get('/fetchData', async (_, res) => {
  try {
    const data = await fetchExternalData();
    const html = generateHTML(data);
    res.send(html);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
});

async function fetchExternalData() {
  const response = await fetch(`${BASE_URL}?action=read&table=${TABLE}`);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
}

function generateHTML(data) {
  let html = '<ul>';
  data.data.forEach(item => {
    html += `<li>ID: ${item.id}, Username: ${item.username}, Email: ${item.email} `;
    html += `<div><button hx-get="/update/${item.id}/edit" hx-target="#updateform">update</button> `;
    html += `<button hx-get="/delete/${item.id}">Delete</button><br/></div></li>`;
  });
  html += '</ul>';
  return html;
}




app.get('/lihat', async (_, res) => {
    const endpointread = `${READDATA}`;

    async function showInfo() {
        try {
            const response = await fetch(endpointread);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    try {
        const data = await showInfo();

        // console.log(data)

        // berdasarkan hasil return json data, kita mendapatkan property success dan objek data.
        // maka untuk menampilkan data, harus ditulis data.data
        // console.log(data.success)
        // console.log(data.data)

        //disini set data.data.map karena data berada nesting json objek
        let dataDisplay = data.data.map((object) => { 
            const { id, username, email } = object;
            console.log(object)
            return `
             
                    <tr>
                        <th scope="row">${id}</th> 
                        <td >${username}</td>
                        <td >${email}</td>
                        <td >
                             <button hx-get="/update/${id}/edit" hx-target="#updateform" hx-swap="outerHTML" >edit</button>
                             <button hx-confirm="Yakin mau hapus?" hx-get="/delete/${id}" hx-target="closest tr" hx-swap="outerHTML" >delete</button>
                        </td>
                    </tr>


            
            `;
        }).join(''); // Join the array elements into a single string

        res.send(dataDisplay);
        // res.send(data.data)
        // res.send(data)
        
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});





app.get('/lihataxios', async (_, res) => {
    const endpointread = `${BASE_URL}?action=read&table=${TABLE}`;

    async function showInfo() {
        try {
            const response = await axios.get(endpointread); // Using axios.get instead of fetch
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    try {
        const data = await showInfo();

        let dataDisplay = data.data.map((object) => {
            const { id, username, email } = object;
            console.log(object);
            return `
                <div>${id} ${username} ${email}</div>
            `;
        }).join('');

        res.send(dataDisplay);

    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});







app.get('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleteUrl = `${DELETEDATA} + ${id}`;
    
    const response = await fetch(deleteUrl, { method: 'GET' });
    if (!response.ok) {
      throw new Error("Failed to delete item");
    }

    res.send("Item deleted successfully");
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ error: "Error deleting item" });
  }
});





app.get('/update/:id/edit', async (req, res) => {
  try {
    const response = await axios.get(`${READDATA}` + `&id=${req.params.id}`);
    const responseData = response.data.data;

    res.send(`

          <div id="updaterespon" style="padding: 1em; border:1px solid; background:#13171f; position: fixed;z-index: 99;top: 50%;left: 25%; ">
          <h1>Edit User ${responseData.id}</h1>
            <form >
              <input type="text" id="username" name="username" value="${responseData.username}">
              <input type="email" id="email" name="email" value="${responseData.email}">
              <div class="grid">
                <button class="outline" hx-get="/" hx-target="body" >Close</button>
                <button hx-post="/update/${req.params.id}" hx-target="#lihatdata" hx-indicator="#updating" >Update</button>
              </div>
            </form>
          </div>
                <div id="updating" class="htmx-indicator" >Sedang mengirim update...</div>

    `);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});



// works with dialog
// app.get('/update/:id/edit', async (req, res) => {
//   try {
//     const response = await axios.get(`${BASE_URL}?action=read&table=${TABLE}&id=${req.params.id}`);
//     const responseData = response.data.data;
//
//     res.send(`
//       <dialog open>
//         <div>
//           <h1>Edit User ${responseData.id}</h1>
//           <div>
//             <form id="updaterespon" >
//               <input type="text" id="username" name="username" value="${responseData.username}">
//               <input type="email" id="email" name="email" value="${responseData.email}">
//               <div class="grid">
//                 <button autofocus class="outline" onclick="htmx.trigger('#updaterespon', 'htmx:abort')" >Close</button>
//                 <button hx-post="/update/${req.params.id}" hx-target="#updaterespon" hx-indicator="#loading" >Update</button>
//               </div>
//                 <div id="loading" class="htmx-indicator">sedang mengirim..</div>
//             </form>
//           </div>
//         </div>
//       </dialog>
//     `);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     res.status(500).send('Error fetching data');
//   }
// });






app.post('/update/:id', async (req, res) => {
  try {
    const { id, username, email } = req.body;
    const dataToUpdate = { id, username, email };

    const updateUrl = `${UPDATEDATA} + ${req.params.id}&data=${encodeURIComponent(JSON.stringify(dataToUpdate))}`;

    const res = await axios.get(updateUrl);

    // res.send(`
    //   <p>Sukses update data</p>
    //   <button autofocus>Close</button>
    // `);
        
    res.send(`Data sudah diupdate`);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});


app.get('/modal-content', () => {

res.send (`
<div id="modal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <p>This is a modal!</p>
    </div>
</div>
`);

});




// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server is listening on port ${port}`);
// });

//const PORT = 3000;
//
//app.listen(PORT, () => {
//    console.log(`server running on http://localhost:${PORT}`);
//}); 

// module.exports = app;




