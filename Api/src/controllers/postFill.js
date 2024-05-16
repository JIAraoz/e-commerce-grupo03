const {Article, Category}=require('../db')
const base_articles=require('../utils/base_articles')
const postFill= async(req,res)=>{
    try {
        const existingArticles = await Article.findAll();
        const existingCategories=await Category.findAll()
        if (existingArticles.length > 0 || existingCategories.length > 0) {
            return res.status(400).json({ message: 'Los registros ya existen en la base de datos' });
        }
        await Category.bulkCreate([
            {categoryName:"electronics"},
            {categoryName:"jewelery"},
            {categoryName:"men's clothing"},
            {categoryName:"women's clothing"}
        ])
        
        const categories = await Category.findAll();
        const createdArticles = await Article.bulkCreate(base_articles.map((e) => ({
            articleName: e.articleName,
            articleDescription: e.articleDescription,
            articlePrice: e.articlePrice,
            articleImage: e.articleImage,
            articleStock: e.articleStock
        })));
        for (const article of createdArticles) {
            const articleCategory = base_articles.find(a => a.id === article.id).category;
            const category = categories.find(cat => cat.categoryName === articleCategory);
            if (category) {
                await article.addCategory(category);
            }
        }

        res.status(201).json({ message: 'Registros creados con éxito', results:createdArticles });

    } catch (error) {
        console.error('Error al crear registros:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

module.exports = postFill;