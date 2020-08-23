const express = require("express");
const router = express.Router();
const Article = require("./../models/article");

router.get("/new", (req, res) => {
  res.render("articles/new", {article: new Article()});
});

router.get("/edit/:id", async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.render("articles/edit", {article: article});
});

router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({slug: req.params.slug})
    if(article == null) {
        res.redirect('/')
        console.log("Article not Found")
    }
    res.render('articles/show', {article: article})
})

//The form in new.ejs is gonna call this post method
router.post('/', async (req, res, next) => {
  req.article = new Article()
  next()
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
  req.article = await Article.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))

//For this, we need to have an action of DELETE, as a link only does get and forms do get and post, so we need to use library method-override
router.delete('/:id', async(req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article 
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown
    try {
      article = await article.save();
      res.redirect(`/articles/${article.slug}`)
    } catch (error) {
      res.render(`articles/${path}`, {article: article})
    }
  }
}

module.exports = router;
