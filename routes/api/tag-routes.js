
const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
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

router.get("/:id", async (req, res) => {
  try {
    const tagThing = await Tag.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          through: ProductTag,
          attributes: ["id", "product_name", "price", "stock"],
        },
      ],
    });
    if (!tagData) {
      res.status(404).json({ message: "No category found with this id" });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.put("/:id", async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tagData = await Tag.update(req.body, {
      where: { id: req.params.id },
    });
    if (!tagData) {
      res.status(404).json({ message: "No catagory with that id #" });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', (req, res) => {
  Tag.create(req.body)
    .then((Tag) => {
      // if there's Tag tags, we need to create pairings to bulk create in the TagTag model
      if (req.body.tagIds.length) {
        const TagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            Tag_id: Tag.id,
            tag_id,
          };
        });
        console.log(req.body)
        return Tag.bulkCreate(TagIdArr);
      }
      // if no Tag tags, just respond
      res.status(200).json(Tag);
    })
    .then((TagIds) => res.status(200).json(CategoryTagIds))
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


router.delete('/:id', async (req, res) => {
  try {
    const productData = await Product.destroy({
      where: { id: req.params.id },
    });
    if (!productData) {
      res.status(404).json({ message: "No catagory with that id #" });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;