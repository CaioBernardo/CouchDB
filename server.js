const express = require('express');
const bodyParser = require('body-parser');
const nano = require('nano')('http://admin:admin@127.0.0.1:5984');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Listar todos registros
app.get('/', (req, res) => {
  const db = nano.db.use('topicos');
  db.list({ include_docs: true }, (err, body) => {
    if (err) {
      res.status(500).send('Erro ao recuperar dados do banco de dados.');
      return;
    }

    res.render('index', { topics: body.rows });
  });
});

//Criar novo registro
app.post('/novo', (req, res) => {
  const db = nano.db.use('topicos');
  const { name } = req.body;
  const { occupation } = req.body;
  const { street } = req.body;
  const { neighborhood } = req.body;
  const { city } = req.body;
  const { state } = req.body;
  const { salary } = req.body;
  
  db.insert({ name, occupation, street, neighborhood, city, state, salary }, (err, body) => {
    if (err) {
      res.status(500).send('Erro ao criar um novo tópico.');
      return;
    }

    res.redirect('/');
  });
});

//Exibir pagina editar
app.get('/vedit/:id', (req, res) => {
  const db = nano.db.use('topicos');
  const { id } = req.params;

  db.get(id, (err, body) => {
    if (err) {
      res.status(404).send('Registro não encontrado.');
      return;
    }
    res.render('edit', { topic: body });
  });
});

//Atualiza registro
app.post('/edit/:id', (req, res) => {
  const db = nano.db.use('topicos');
  const { id } = req.params;

  db.get(id, (err, body) => {
    if (err) {
      res.status(404).send('Registro não encontrado.');
      return;
    }

    body.name = req.body.name;
    body.occupation = req.body.occupation;
    body.street = req.body.street;
    body.neighborhood = req.body.neighborhood;
    body.city = req.body.city;
    body.state = req.body.state;
    body.salary = req.body.salary;

    db.insert(body, id, (err, response) => {
      if (err) {
        console.error(err);
        res.status(500).send('Erro ao atualizar o registro.');
        return;
      }
      res.redirect('/');
    });
  });
});

//Excluir registro
app.get('/delete/:id', (req, res) => {
  const db = nano.db.use('topicos');
  const { id } = req.params;

  db.get(id, (err, body) => {
    if (err) {
      res.status(404).send('Registro não encontrado.');
      return;
    }

    db.destroy(id, body._rev, (err, body) => {
      if (err) {
        res.status(500).send('Erro ao excluir o tópico.');
        return;
      }
      res.redirect('/');
    });
  });
});

//Orelhão
app.listen(port, () => {
  console.log(`Servidor Node.js em execução na porta ${port}`);
});