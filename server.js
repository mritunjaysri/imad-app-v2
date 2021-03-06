var express = require('express');
var morgan = require('morgan');
var path = require('path');

var Pool = require('pg').Pool;  //import db-connection

//config db
var config = {
    user: {USER_NQME},
    database: '{DB}',
    host: '{HOST}',
    port: '{PORT',
    password: '{PASSWORD}'
};

var app = express();
app.use(morgan('combined'));

//content details
var articles = {
    'article-one': {
        title: 'Aritcle-One',
        heading: 'Article-One',
        date: 'Sep 5, 2016',
        content: `<p>
                    Thies is First Article.
                </p>
                <p>
                    <a href="/">Home</a>
                </p>`
    },
    'article-two': {
        title: 'Aritcle-Two',
        heading: 'Article-Two',
        date: 'Sep 5, 2016',
        content: `<p>
                    Thies is Second Article.
                </p>
                <p>
                    <a href="/">Home</a>
                </p>`
    },
    'article-three': {
        title: 'Article-Three',
        heading: 'Article-Three',
        date: 'Sep 5, 2016',
        content: `<p>
                    Thies is Three Article.
                </p>
                <p>
                    <a href="/">Home</a>
                </p>`
    }
};

//merge Html and java_script 
function createTemplate (data) {
    var title = data.title;
    var heading = data.heading;
    var date = data.date;
    var content = data.content;
    
    var htmlTemplate = `
    <html>
        <head>
            <title>${title}</title>
            <link href="/ui/style.css" rel="stylesheet" />
        </head>
        <body>
            <div class="container">
                <div>
                    ${title}
                </div>
                <div>
                    ${date.toDateString()}
                </div>
                <div>
                  ${content}
                </div>
            </div>
        </body>
    </html>`
    ;
    
    return htmlTemplate;
}

//index.htmldb-mritunjaysri-34582
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

//db connection establish
var pool = new Pool(config);
app.get('/test-db', function(req, res){
   pool.query('SELECT * FROM article', function(err, result){       //make a request
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));               //return with response with result
      }
   });
});

//mergejshtml.html
app.get('/:articleName', function (req, res) {
    var articleNmae = req.params.articleName;
    res.send(createTemplate(articles[articleName]));
});


//db content
app.get('/articles/:articleName', function (req, res) {
    pool.query("SELECT * FROM article WHERE title = $1", [req.params.articleName] , function(err, result){       //make a request
      if (err) {
          res.status(500).send(err.toString());
      } else {
          if (result.rows.length === 0) {
              res.status(404).send('Article not found');
          } else {
              var articleData = result.rows[0];
              res.send(createTemplate(articleData));
          }
      }
   });
});

//counter
var counter=0;
app.get('/counter', function(req, res){
    counter = counter + 1;
    res.send(counter.toString());                   //toString() convert int to string.
});

//style.css
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

//madi.png
app.get('/ui/Profile.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'Profile.jpg'));
});

//main.js
app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

//set port
var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
