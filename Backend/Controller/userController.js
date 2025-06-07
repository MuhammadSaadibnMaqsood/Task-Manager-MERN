import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../Model/userModel.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "Your secret here";
const TOKEN_EXPIRE = '24h';

const createToken = (userid) => jwt.sign({ id: userid }, JWT_SECRET, { expiresIn: TOKEN_EXPIRE });

// REGISTER USER
export async function registor(req, res) {
    const { name, email, pass } = req.body;

    if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: 'Enter valid email' });
    }
    if (!name || !email || !pass) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    if (pass.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const hashed = await bcrypt.hash(pass, 10);
        const user = await userModel.create({ name, email, password: hashed });
        const token = createToken(user._id);

        res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

// LOGIN USER
export async function login(req, res) {
    const { email, pass } = req.body;

    if (!email || !pass) {
        return res.status(400).json({ success: false, message: 'All credentials are required' });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        const match = await bcrypt.compare(pass, user.password);

        if (!match) {
            return res.status(400).json({ success: false, message: 'Wrong password' });
        }

        const token = createToken(user._id);

        res.status(200).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

// GET CURRENT USER
export async function currentUser(req, res) {
    try {
        const user = await userModel.findById(req.user.id).select('name email');

        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, user });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

// UPDATE USER
export async function updateUser(req, res) {
    const { name, email } = req.body;

    if (!name || !email || !validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: 'Enter valid name and email' });
    }

    try {
        const exist = await userModel.findOne({ email, _id: { $ne: req.user.id } });

        if (exist) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }

        const user = await userModel.findByIdAndUpdate(req.user.id, { name, email }, { new: true, runValidators: true }).select('name email');

        res.json({ success: true, user });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

//CHANGE PASSWORD
export async function changePassword(req, res) {
    const { currentpassword, newPassword } = req.body;

    if (!currentpassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    try {
        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const match = await bcrypt.compare(currentpassword, user.password);

        if (!match) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        await user.save();

        res.status(200).json({ success: true, message: 'Password updated successfully' });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}
