// router.get('/', (req, res) => {
//   res.render('index', { title: 'Express' });
// });

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  console.log('Hellooooooooooooooooo!');
});

module.exports = router;
