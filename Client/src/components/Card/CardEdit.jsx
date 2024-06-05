import { useState, useEffect } from 'react';
import './cardEdit.css';

export default function CardEdit({ id, title, image, price, isActive }) {
	const [status, setStatus] = useState(isActive);

	useEffect(() => {
		setStatus(isActive);
	}, [isActive]);

	const handleButtonClick = () => {
		const newStatus = !status;
		const url = `https://e-commerce-grupo03.onrender.com/admin/ChangeStatusArticle?id=${id}&status=${newStatus}`;
		console.log(`Enviando solicitud a: ${url}`);
		fetch(url, { method: 'POST' })
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				if (data.message === 'item status changed successfully') {
					setStatus(newStatus);
					alert(
						`El producto ha sido ${newStatus ? 'activado' : 'desactivado'} exitosamente.`,
					);
				} else {
					alert('Hubo un error al intentar cambiar el estado del producto.');
				}
			})
			.catch((error) => console.error(error));
	};

	return (
		<div className='Mi-Componente-CardEdit'>
			<div className='Mi-Item-CardEdit'>
				<div className='image-container-CardEdit'>
					<img src={image} alt={title} />
				</div>
				<div className='Mi-Item-Details-CardEdit'>
					<h2 className='Mi-Componente-title-CardEdit'>{title}</h2>
					<p className='price-CardEdit'>${price}</p>
					<p>Status: {status ? 'Active' : 'Inactive'}</p>
				</div>

				<div className='card-footer-CardEdit'>
					<button onClick={handleButtonClick}>
						{status ? 'Disable' : 'Enable'}
					</button>
				</div>
			</div>
		</div>
	);
}
