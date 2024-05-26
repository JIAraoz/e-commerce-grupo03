// Detail.jsx
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Detail.css';

import { useEffect, useState } from 'react';

export default function Detail() {
	const { id } = useParams();
	const [product, setProduct] = useState(null);
	const { user } = useAuth0();

	useEffect(() => {
		async function getProduct() {
			try {
				const { data } = await axios.get(`https://e-commerce-grupo03.onrender.com/article/detail/${id}`);
				setProduct(data);
			} catch (error) {
				console.error('Error fetching product details:', error);
			}
		}
		getProduct();
	}, [id]);

	if (!product) {
		return <div>Producto no encontrado</div>;
	}

	const handleAddToCart = async () => {
		try {
			const userResponse = await axios.get(
				`https://e-commerce-grupo03.onrender.com/user/user_email?email=${user.email}`
			);

			if (userResponse.data.result.userId) {
				const cartResponse = await axios.get(
					`https://e-commerce-grupo03.onrender.com/cart/getShoppingCart?id=${userResponse.data.result.userId}`
				);

				const activeCart = cartResponse.data.result.find(cart => cart.isActive === true);
				if (activeCart) {
					const addArticleResponse = await axios.get(
						`https://e-commerce-grupo03.onrender.com/cart/add_article_cart?cartid=${activeCart.cartId}&articleid=${id}&quantity=${1}`
					);
					if (addArticleResponse) {
						alert("Tu producto ha sido agregado al carrito");
					}
				} else {
					alert("No hay carrito activo disponible.");
				}
			}
		} catch (error) {
			console.error('Ha ocurrido un error: ' + error.message);
		}
	};

	return (
		<div>
			<button id='back-button'>Back</button>
			<div className='detail-container'>
				<div className='photo-container'>
					<img src={product.articleImage} alt={product.articleName} />
				</div>
				<div className='detail'>
					<h1 className='name'>{product.articleName}</h1>
					<h4 className='price'>${product.articlePrice}</h4>
					<div className='pay'>
						<div className='size-options'>
							<p>Size:</p>
							<select>
								<option value='xs'>XS</option>
								<option value='s'>S</option>
								<option value='m'>M</option>
								<option value='l'>L</option>
							</select>
						</div>
						<div className='payment-methods'>
							<p>Payment Methods</p>
							<img src='/pagos.png' alt='pay' />
						</div>
					</div>
					<p className='stock'>Stock: {product.articleStock} pcs</p>
					<div className='cart-container'>
						<button className='add-to-cart' onClick={() => handleAddToCart()}>Add to Cart</button>
						<p className='free-shipping'>Free Shipping!!</p>
					</div>
				</div>
			</div>
			<div className='description-container'>
				<h1>Description:</h1>
				<h4>{product.articleDescription}</h4>
				<h4>Category: {product.categories[0].categoryName}</h4>
			</div>
		</div>
	);
}
