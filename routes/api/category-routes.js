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
  const oneCategory = await Category.findByPk(req.params.id, {
  include: [{ model: Product,
  attributes: ['product_name', 'price', 'stock']}]
  })
    if (!categoryData) {
      res.status(404).json({ message: 'No catagory found with that id'});
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  await res.json(`${req.method} request made`)
  try {
    const categoryData = await Category.update(req.body, {
      where: { id: req.params.id }
    });
    if (!categoryData) {
      res.status(404).json({ message: 'No category found with that id' });
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});
  // const { id, category_name } = req.body
    // const newCategory = await Category.findOrCreate()
    // const data = await JSON.parse(JSON.stringify(res))
router.put('/:id', (req, res) => {
    // update a category by its `id` value
});


//delete id's thing
router.delete('/:id', (req, res) => {
  try {
    const categoryData = Category.destroy({
      where: { id: req.params.id }
    });
    //if no id doesnt match
    if (!categoryData) {
      res.status(404).json({ message: 'No category found with that id' });
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
