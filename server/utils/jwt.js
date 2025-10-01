import jwt from 'jsonwebtoken';

const sendToken = (user, statusCode, res, isRedirect = false) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '3d',
    });

    const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    };

    res.cookie('token', token, options);

    if (isRedirect) {
        res.redirect(process.env.FRONTEND_URL);
    } else {
        res.status(statusCode).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
            token,
        });
    }
};

export default sendToken;