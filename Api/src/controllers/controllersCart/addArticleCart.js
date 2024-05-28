const { ShoppingCart, Article,Cart_Articule } = require('../../db');

const addArticleCart = async (req, res) => {
    try {
        const idCart = req.query.cartid;
        const idArticle = req.query.articleid;
        const quantity = parseInt(req.query.quantity, 10);

        const cart = await ShoppingCart.findOne({
            where: {
                cartId: idCart
            },
            include: {
                model: Article
            }
        });

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        const article = await Article.findByPk(idArticle);
        if (!article) {
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }
        const articleExist=await Cart_Articule.findOne({where:{
            articleArticleId:article.articleId,
            shoppingCartCartId:cart.cartId
        }})
        if(articleExist===null){
            await cart.addArticle(article, { through: { articleQuantity:quantity } });
            
            const response = await Article.findByPk(article.articleArticleId);
            console.log(response.dataValues)
            const subtotalAux = response.dataValues.articlePrice * parseInt(quantity);
            cart.dataValues.subtotal += subtotalAux;
            console.log("Existente")
            console.log(cart)
            await cart.save();
        }else{
            const response = await Article.findByPk(articleExist.articleArticleId);
            console.log(response.dataValues)
            const subtotalAux = response.dataValues.articlePrice * parseInt(quantity);
            cart.dataValues.subtotal += subtotalAux;
            console.log("No existente")
            console.log(cart)
            await cart.save();
            articleExist.articleQuantity += quantity;
            await articleExist.save();
        }
        const updatedCart = await ShoppingCart.findOne({
            where: { cartId: idCart },
            include: { model: Article }
        });

        res.status(200).json({
            message: 'Artículo agregado al carrito con éxito',
            cart: updatedCart
        });

       
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}

module.exports = addArticleCart;

