
const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint
  // find all tags
router.get("/", async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [
        {
          model: Product,
          through: ProductTag,
          attributes: ["id", "product_name", "price", "stock"],
        },
      ],
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  const tag = await Tag.findOne({
    include: [
      {
        model: Product,
        through: ProductTag,
        attributes: ["id", "product_name", "price", "stock"],
      },
    ],
    where: {
      id: req.params.id
    },
  })
  res.status(200).json(tag);
})


//Replace data based on choosen ID
router.put('/:id', async (req, res) => {
  await res.json(`${req.method} request made`)
  try {
    const tagData = await Tag.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    if (!tagData) {
      res.status(404).json({
        message: 'No tag found with that id'
      })
      res.status(200).json(tagData);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});


router.post('/', (req, res) => {
  Tag.create(req.body)
    .then((Tag) => {
      // if there's Tag tags, we need to create pairings to bulk create in the TagTag model
      if (req.body.tagIds) {
        const TagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            Tag_id: Tag.id,
          };
        });
        console.log(req.body)
        return Tag.bulkCreate(TagIdArr);
      }
      // if no Tag tags, just respond
      res.status(200).json(Tag);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.delete("/:id", async (req, res) => {
  try {
    const tagData = await Tag.destroy({
      where: { id: req.params.id },
    });
    if (!tagData) {
      res.status(404).json({ message: "No TAG with that id #" });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Delete a tag
module.exports = router;