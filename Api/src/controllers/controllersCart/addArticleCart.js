const { ShoppingCart, Article, Size, Cart_Articule, Article_Size } = require('../../db');

const addArticleCart = async (req, res) => {
    try {

        const { idCart, idArticle, S, M, L, XL, XXL } = req.body;

        const quantity = S + M + L + XL + XXL;

        const cart = await ShoppingCart.findOne({
            where: {
                cartId: idCart
            },
            include: {
                model: Article,
                include: {
                    model: Size
                }
            }
        });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const article = await Article.findByPk(idArticle);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        if(article.stock < 1 || 
            article.articleS < S || 
            article.articleM < M || 
            article.articleL < L || 
            article.articleXL < XL || 
            article.articleXXL < XXL){
                return res.status(404).json({
                    message: 'Article out of stock'
                });
            }
        
        const articleExist=await Cart_Articule.findOne({where:{
            articleArticleId:article.articleId,
            shoppingCartCartId:cart.cartId
        }})
        if(articleExist===null){
            await cart.addArticle(article, { through: { articleQuantity:quantity, S, M, L, XL, XXL } });
            
            const response = await Article.findByPk(article.articleArticleId);
            const subtotalAux = response.dataValues.articlePrice * parseInt(quantity);
            cart.cartSubtotal += subtotalAux;
            
            await cart.save();
        }else{
            const response = await Article.findByPk(articleExist.articleArticleId);
            console.log(response.dataValues.articlePrice)
            const subtotalAux = response.dataValues.articlePrice * parseInt(quantity);
            console.log(subtotalAux);
            cart.cartSubtotal += subtotalAux;
            await cart.save();
            articleExist.S += S;
            articleExist.M += M;
            articleExist.L += L;
            articleExist.XL += XL;
            articleExist.XXL += XXL;
            articleExist.articleQuantity += quantity;
            await articleExist.save();
        }
        const updatedCart = await ShoppingCart.findOne({
            where: { cartId: idCart },
            include: { model: Article }
        });

        res.status(200).json({
            message: 'Article successfully added to cart',
            cart: updatedCart
        });

       
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = addArticleCart;

