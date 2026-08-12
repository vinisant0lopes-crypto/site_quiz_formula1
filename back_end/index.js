import express from 'express'
import cors from 'cors'

const app = express()


app.use(cors({
    origin: '*'
}));

app.get('/rota1', (req, res) => {
  res.json({
    mensagem: 'Ola'
  })
})

app.get('/rota2', (req, res) => {
  res.send('Rota 2')
})


app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})