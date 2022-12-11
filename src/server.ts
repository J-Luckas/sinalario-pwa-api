import axios from "axios";
import express from "express";

const app = express();
app.use(express.json());


app.get('/', async (req, res) => {
  console.log('Client connected')
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Access-Control-Allow-Origin', '*')
  
  let filmeAnterior = await axios.get('http://localhost:3333/movies');
  let filmeAnteriorId = filmeAnterior.data[filmeAnterior.data.length - 1].id;

  const intervalId = setInterval( async () => {
    let req = await axios.get('http://localhost:3333/movies');
    let ultimoId = req.data[req.data.length - 1].id;
    
    if( filmeAnteriorId !== ultimoId ) {
      res.write(`data: Novo filme adicionado - ${ultimoId}\n\n`);
      filmeAnteriorId = ultimoId;
      console.log('MUDOU');
    }
        
  }, 1000)

  res.on('close', () => {
    console.log('Client closed connection')
    clearInterval(intervalId)
    res.end()
  })
})


const port = 3002;

app.listen(port, () => console.log('listening on port: ' + port));