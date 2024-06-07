const { Review, User } = require('../../db');

const getAllReviews = async (req, res) => {
    try {
        const pageSize = parseInt(req.query.size, 10) || 5;
        const page = parseInt(req.query.page, 10) || 1;
        const order = req.query.order || 'createdAt-desc';

        const orderCondition = [];
        switch (order) {
            case 'review-asc':
                orderCondition.push(['reviewRating', 'ASC']);
                break;
            case 'review-desc':
                orderCondition.push(['reviewRating', 'DESC']);
                break;
            case 'date-asc':
                orderCondition.push(['createdAt', 'ASC']);
                break;
            case 'date-desc':
                orderCondition.push(['createdAt', 'DESC']);
                break;
            default:
                orderCondition.push(['createdAt', 'DESC']);
        }

        if (isNaN(pageSize) || pageSize <= 0 || isNaN(page) || page <= 0) {
            return res.status(400).json({ message: 'Invalid pagination parameters' });
        }

        const offset = (page - 1) * pageSize;

        const { count, rows } = await Review.findAndCountAll({
            offset,
            limit: pageSize,
            order: orderCondition,
            include: [{
                model: User,
                as: 'user',
                attributes: ['userId', 'userName', 'userEmail', 'userImage', "userRol"]
            }]
        });

        if (count === 0) {
            return res.status(404).json({ message: 'No reviews found' });
        }

        const totalPages = Math.ceil(count / pageSize);

        res.status(200).json({
            message: 'Data successfully obtained',
            totalPages,
            currentPage: page,
            result: rows
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = getAllReviews;
