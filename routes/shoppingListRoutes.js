const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const items = require("../fakeDb");

router.get("/", function(req, res, next){
   return res.json({ items });
})

router.post("/", function(req, res, next){
    try{
        if(!req.body.name || !req.body.price){
            throw new ExpressError("Name and price are required!", 400);
        };
        if(isNaN(req.body.price)) throw new ExpressError("Provide a valid number for price!", 400);
        const newItem = {
            name: req.body.name,
            price: +req.body.price
        };
        items.push(newItem);
        return res.status(201).json({ added: newItem});
    }
    catch(e){
        return next(e);
    }
})

router.get("/:name", function(req, res, next){
try{
    const foundItem = items.find(item => item.name === req.params.name);
    if(foundItem === undefined){
        throw new ExpressError("Item not found", 404);
    }
    return res.json({ item: foundItem });
}
catch(e){
    return next(e);
}
})

router.patch("/:name", function(req, res, next){
    try{
        const foundItem = items.find(item => item.name === req.params.name);
        if(foundItem === undefined){
            throw new ExpressError("Item not found", 404);
        }
        foundItem.name = req.body.name;
        return res.json({ updated: foundItem });
    }
    catch(e){
        return next(e);
    }
})

router.delete("/:name", function (req, res, next){
    try{
        const foundItem = items.findIndex(item => item.name === req.params.name);
        if(foundItem === -1){
            throw new ExpressError("Item not found", 404);
        }
        items.splice(foundItem, 1);
        return res.json({ message: "Deleted" });
    }
    catch(e){
        return next(e);
    }
})

module.exports = router;