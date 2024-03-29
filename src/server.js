const express = require("express")
const server = express()

// pegar o banco de dados
const db = require("./database/db")
//configurando pasta publica
server.use(express.static("public"))

//habilitar o uso do req.body na aplicação
server.use(express.urlencoded({ extended: true }))

//utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true,
})
// configurando caminhos da aplicação 
    //index

server.get("/", (req, res) =>{ // req: requisão "pergunta". res: resposta à requisição.
    return res.render("index.html", {title: "titulo"})
})

    //create-point
server.get("/create-point", (req, res) =>{

    //console.log(req.query)


    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) =>{

    //req.body: O corpo do nosso formulario
    //console.log(req.body)
    const query = `
    INSERT INTO places (
        image,
        name,
        address,
        address2,
        state,
        city,
        items
    ) VALUES (?, ?, ?, ?, ?, ?, ?);
    `
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items,
    ]
    
    function afterInsertData(err){
        if(err) {
            console.log(err)
            return res.send("Erro no cadastro!")
        }
        console.log("Cadastrado com sucesso")
        console.log(this)

            return res.render("create-point.html", { saved: true})

    }

    db.run(query, values, afterInsertData)

})


    // search-results
server.get("/search-results", (req, res) =>{
    const search = req.query.search

    if(search == "") {
        //pesquisa vazia
        return res.render("search-results.html", {total: 0})
    }




    //pegar os dados do baco de dados
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
        if(err) {
            return console.log(err)
        }
        const total = rows.length

        // mostrar a pagina HTML com os dados do banco de dados
        return res.render("search-results.html", {places: rows, total: total})

    })

})

//ligando o servidor
server.listen(3000, function() {
    console.log("Servidor ligado, bons estudos!!")
})
