import express from 'express';
import  redisClient from './redis';
const app = express();
const PORT = 8080

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.use(express.json());


app.post('/api/generate-code',async function(req, res){
  try{
    const file = req.body;
    const code = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    await redisClient.setEx(code.toString(),600, code.toString());
    res.json({code});
  }catch(error){
    console.error("Redis Error:", error); 
    res.sendStatus(501);
  }
  
})

app.get('/api/validate-code/:code', async function (req, res) {
  try{
    const code = req.params.code;
    const key = await redisClient.get(code);
    res.json(key);
  }catch(error){
    console.error(error);
    res.json("invalid key and error is");
  }

})


app.listen(PORT);
