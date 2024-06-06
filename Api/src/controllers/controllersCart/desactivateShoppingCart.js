const { ShoppingCart, Article,  Cart_Articule} = require('../../db');

/* const desactivateShoppingCart = async (req, res) => {
    try {
        const cartId = req.query.cartId;
        if (cartId) {
            const cartToDesactivate = await ShoppingCart.findByPk(
                cartId, {
                    include: {
                        model: Article,
                        through: {
                            attributes: ['articleQuantity']
                        }
                    }
                });

            if (cartToDesactivate) {
                cartToDesactivate.isActive = false;

                for (const article of cartToDesactivate.articles) {
                    const newStock = article.articleStock - article.Cart_Articule.articleQuantity;
                    if (newStock < 0) {
                        return res.status(400).json({ message: `Insufficient stock for the article ${article.title}` });
                    }
                }

                for (const article of cartToDesactivate.articles) {
                    article.articleS -= article.Cart_Articule.S;
                    article.articleM -= article.Cart_Articule.M;
                    article.articleL -= article.Cart_Articule.L;
                    article.articleXL -= article.Cart_Articule.XL;
                    article.articleXXL -= article.Cart_Articule.XXL;
                    article.articleStock -= article.Cart_Articule.articleQuantity;
                    await article.save();
                }

                await cartToDesactivate.save();
                return res.status(200).json({ message: 'Cart successfully paid' });
            } else {
                return res.status(404).json({ message: 'Cart not found' });
            }
        } else {
            return res.status(400).json({ message: 'Missing or invalid data in the request body' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = desactivateShoppingCart; */


const { ShoppingCart, Article, Cart_Article } = require('../../db');

const desactivateShoppingCart = async (req, res) => {
    try {
        const cartId = req.query.cartId;
        if (cartId) {
            const cartToDesactivate = await ShoppingCart.findByPk(cartId, {
                include: {
                    model: Article,
                    through: {
                        model: Cart_Article,
                        attributes: ['articleQuantity']
                    }
                }
            });

            if (cartToDesactivate) {
                for (const article of cartToDesactivate.articles) {
                    const cartArticle = article.Cart_Article;
                    const newStock = article.articleStock - cartArticle.articleQuantity;
                    if (newStock < 0) {
                        return res.status(400).json({ message: `Insufficient stock for the article ${article.title}` });
                    }

                    // Actualizar existencias de tallas
                    article.articleS -= cartArticle.S;
                    article.articleM -= cartArticle.M;
                    article.articleL -= cartArticle.L;
                    article.articleXL -= cartArticle.XL;
                    article.articleXXL -= cartArticle.XXL;

                    // Actualizar existencias generales
                    article.articleStock -= cartArticle.articleQuantity;

                    await article.save();
                }

                cartToDesactivate.isActive = false;
                await cartToDesactivate.save();

                return res.status(200).json({ message: 'Cart successfully paid' });
            } else {
                return res.status(404).json({ message: 'Cart not found' });
            }
        } else {
            return res.status(400).json({ message: 'Missing or invalid data in the request body' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = desactivateShoppingCart;
