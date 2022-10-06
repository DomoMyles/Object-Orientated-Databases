const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
    
  Category.findAll({
    attributes:['id', 'category_name'],
    include: [
      {
        model:Product,
        attributes:['id', 'product_name', 'price','stock','category_id']
      }
    ]
  }).then(data => {
    res.json(data)
  }).catch(err => {
    console.log('Error: ', err)
  }) 
  
});

router.get('/:id', async (req, res) => {
  try {
  const oneCategory = await Category.findOne()
  res.json(oneCategory)
  } catch (err) {
    console.log(err)
  }
  // be sure to include its associated Products
});

router.post('/', async (req, res) => {
  await res.json(`${req.method} request made`)

  // const { id, category_name } = req.body
    // const newCategory = await Category.findOrCreate()
    // const data = await JSON.parse(JSON.stringify(res))
    });

router.put('/:id', (req, res) => {
    // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
