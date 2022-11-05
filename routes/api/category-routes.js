const router = require('express').Router();
const {
  Category,
  Product
} = require('../../models');

// The `/api/categories` endpoint



router.get('/', (req, res) => {

  Category.findAll({
    attributes: ['id', 'category_name'],
    include: [{
      model: Product,
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
    }]
  }).then(data => {
    res.json(data)
  }).catch(err => {
    console.log('Error: ', err)
  })
});

//get One by
router.get('/:id', async (req, res) => {

  const category = await Category.findOne({
    attributes: ['id', 'category_name'],
    include: [{
      model: Product,
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
    }],
    where: {
      id: req.params.id
    },
  })
  res.status(200).json(category);
console.log(category.dataValues)
})





router.post('/', (req, res) => {
  Category.create(req.body)
    .then((Category) => {
      // if there's Category tags, we need to create pairings to bulk create in the CategoryTag model
      if (req.body.tagIds.length) {
        const CategoryTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            Category_id: Category.id,
            tag_id,
          };
        });
        console.log(req.body)
        return CategoryTag.bulkCreate(CategoryTagIdArr);
      }
      // if no Category tags, just respond
      res.status(200).json(Category);
    })
    .then((CategoryTagIds) => res.status(200).json(CategoryTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put('/:id', async (req, res) => {
  await res.json(`${req.method} request made`)
  try {
    const categoryData = await Category.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    if (!categoryData) {
      res.status(404).json({
        message: 'No category found with that id'
      });
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

router.delete('/:id', async (req, res) => {
  try {
    const CategoryData = await Category.destroy({
      where: {
        id: req.params.id
      },
    });
    if (!CategoryData) {
      res.status(404).json({
        message: "No catagory with that id #"
      });
      return;
    }
    res.status(200).json(CategoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;