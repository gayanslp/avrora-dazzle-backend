export function getProfile(req, res) {
    try {
        res.status(200).json({
            success: true,
            message: 'Profile fetched successfully',
            user: req.user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }

}


export function updateProfile(req, res) {
    
}

export function isAdmin(req) {
    try {
        if (req.user.role === 'admin') {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}
