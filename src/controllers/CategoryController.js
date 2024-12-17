const Category = require("../models/Category");

class CategoryController {
    create(req, res, next) {
        const newCategory = new Category({name: req.body.name});
        newCategory.save()
        .then((newCategory) => res.status(201).json(newCategory))
        .catch(next);
    }
    
    delete(req, res, next) {
        Category.delete({_id: res.params.id})
        .then((result) => res.status(200).json({message: "Delete success"}))
        .catch(next);
    }

    showAll(req, res, next) {
        Category.find()
        .then((allCategory) => res.json(allCategory))
        .catch(next);
    }
}

module.exports = new CategoryController();
