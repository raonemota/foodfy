const fs = require('fs')
const data = require('./data.json')
const { date } = require('./utils')

exports.list = function(req, res){
    let auxDados = []

    for(recipe of data.recipes){
        const auxRecipe = {
            ...recipe,
            create_at: date(recipe.create_at).iso
        }
        auxDados.push(auxRecipe)
    }

    console.log(auxDados)

    return res.render('admin/list', { recipes: auxDados } )
}

exports.create = function(req, res){
    return res.render('admin/create')
}

exports.show = function(req, res){

    const { id } = req.params

    const foundRecipe = data.recipes.find(function(recipe){
        return recipe.id == id
    })

    if (!foundRecipe) return res.send("Não foi encontrado receita")

    const recipe = {
        ...foundRecipe,
        create_at: date(foundRecipe.create_at).iso
    }

    return res.render("admin/show", { recipe })

}

exports.post = function(req, res){

    const keys = Object.keys(req.body)

    for(key of keys){
        if(req.body[key] == ""){
            return res.send("Please, fill all fields!!")
        }
    }

    let { 
        img_recipe,
        title,
        ingredients,
        method_of_preparation,
        aditional_info
        } = req.body 

    
    const id = Number(data.recipes.length + 1)

    const create_at = Date.now()

    data.recipes.push({
        id,
        img_recipe,
        title,
        ingredients,
        method_of_preparation,
        aditional_info,
        create_at
    })

    fs.writeFile("data.json", JSON.stringify(data,null, 2), function(err){
        if (err) return res.send("Write file error!")

        return res.redirect("/admin/create")
    })

}

exports.edit = function(req, res){

    const { id } = req.params

    const foundRecipe = data.recipes.find(function(recipe){
        return recipe.id == id
    })

    if (!foundRecipe) return res.send("Não foi encontrado receita")

    recipe = foundRecipe

    return res.render("admin/edit", { recipe })

}

exports.put = function(req, res){

    const { id } = req.body

    let index = 0

    const foundRecipe = data.recipes.find(function(recipe, foundIndex){
        if(id == recipe.id){
            index = foundIndex
            return true
        }
    })

    if(!foundRecipe) return res.send("Recipe not found")

    const recipe = {
        ...foundRecipe,
        ...req.body,
        id: Number(req.body.id)
    }

    data.recipes[index] = recipe

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if (err) return res.send("Write file error!")

        return res.redirect(`/admin/show/${id}`)
    })

}