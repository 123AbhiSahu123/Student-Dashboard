import { User, Data } from "../models/stumodels.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";


// Register feature in Table {stutable} 
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });
        return res.status(201).json({
            message: "User Created!", user:
                { name, email }
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

//  Login feature in Table {stutable} 
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "User don't find!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Wrong password!" });

        const token = jwt.sign(
            { id: user.id },  //Object structure  
            process.env.JWT_SECRET,   // secure environment Variable
            { expiresIn: "1d" } //Expiry ()
        );

        const cookieOptions = {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "lax"
        }

        return res.status(200)
            .cookie("token", token, cookieOptions)   // sahi name , value and options
            .json({
                message: "Login Success", token
            });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// registerData
export const registerData = async (req, res) => {
    try {
        const { course, phone, age, location } = req.body;

        const newData = await Data.create({
            course,
            phone,
            age,
            location,
            UserId: req.user.id
        });
        return res.status(201).json({
            message: "Data Created!", data:
                { course, phone, age, location }
        });
    } catch (err) {
        // res.status(400).json({ error: err.message });
        console.log(err.errors);

        return res.status(400).json({
            message: err.message,
            details: err.errors?.map(e => e.message)  // err see in details 
        });
    }
};

// Profile Get
export const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'name', 'email'],

            // include: [{
            //     model: Data,  //only this used then output get "Datum" in default is singular term of "Data"
            //     attributes: ['course', 'phone', 'age', 'location']
            // }],

            include: [{
                model: Data,  //only this used then output get "Datum" in default is singular term of "Data"
                as: "studentData",   //alies
                attributes: ['course', 'phone', 'age', 'location']
            }]
        });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }
}