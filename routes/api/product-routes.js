const router = require('express').Router();
const {Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  Product.findAll({
    attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
    include: [{
      model: Tag,
      attributes: ['id', 'tag_name']
    }, ]
  }).then(data => {
    res.json(data)
  }).catch(err => {
    console.log('Error: ', err);
  })
});

// get one product

//get One by id
router.get('/:id', async (req, res) => {
  const product = await Product.findOne({
    attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
    include: [{
      model: Tag,
      attributes: ['id', 'tag_name']
    }],
    where: {
      id: req.params.id
    },
  })
  res.status(200).json(product);
})


// create new product
router.post('/', (req, res) => {
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.product_id) {
        const productTagIdArr = req.body.product_id.map((product_id) => {
          return {
            product_id: product.id,
          };
        });
        console.log(req.body)
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
//Replace data based on choosen ID
router.put('/:id', async (req, res) => {
  await res.json(`${req.method} request made`)
  try {
    const productData = await Product.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    if (!productData) {
      res.status(404).json({
        message: 'No product found with that id'
      })
      res.status(200).json(productData);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id
      },
    });
    if (!productData) {
      res.status(404).json({
        message: "No catagory with that id #"
      });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;