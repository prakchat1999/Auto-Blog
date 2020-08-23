const mongoose = require("mongoose");
//marked converts markdown to HTML
const marked = require('marked')
const slugify = require('slugify')
//Following purifies the HTML
const createDomPurifier = require('dompurify')
const {JSDOM} = require('jsdom')
const dompurify = createDomPurifier(new JSDOM().window)

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  markdown: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  sanitizedHtml: {
    type: String,
    required: true
  }
});

articleSchema.pre('validate', function(next){
  if(this.title){
    this.slug = slugify(this.title, {lower: true, strict: true})
  }
  //Following if will protect from malicious HTML code
  if(this.markdown){
    this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
  }
  next()
})
module.exports = mongoose.model('Article', articleSchema)