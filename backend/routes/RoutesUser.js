const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../Models/user');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'younesmanita975@gmail.com',
        pass: 'juxv pbpm osgp nqfd',
    },
    tls: {
        rejectUnauthorized: false
    },
  });

router.post('/signup', async (req, res) => {
    try {
        const email = ((req.body.Email).toLowerCase()).trim();
        const existingUser = await User.findOne({ Email: email });
console.log(req.body);

        if (existingUser) {
            return res.status(401).json({ message: "Email déjà existe" });
        }

        const hashedPassword = await bcrypt.hash(req.body.Password, await bcrypt.genSalt(10));
        const newUser = new User({
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            Username: req.body.Username,
            Email: email,
            Gouvernerat:req.body.Gouvernorat,
            password: hashedPassword,
            Role: req.body.Role,
            Adresse: req.body.Adresse,
        });

        const savedUser = await newUser.save();
        res.status(200).json({ result: savedUser, message: "User signup avec succès" });
    } catch (error) {
        console.log(error);
        
        res.status(400).json(error);
    }
});

router.post('/login', async (req, res) => {
    try {
        const email = req.body.Email.toLowerCase().trim();
        const user = await User.findOne({ Email: email });

        if (!user) {
            return res.status(401).json("Check your email");
        }

        const isPasswordValid = await bcrypt.compare(req.body.Password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json("Check your password");
        } else if (!user.confirmed) {
            const code = Math.floor(Math.random() * (9999 - 1000) + 1000);
            await transporter.sendMail({
                from: 'Admin Salle',
                to: user.Email,
                subject: 'Confirmation Code',
                html: `
                <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation Code</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #007BFF;
            color: white;
            padding: 10px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            margin: 0;
        }
        .content {
            padding: 20px;
        }
        .content p {
            font-size: 16px;
            line-height: 1.5;
        }
        .code {
            background-color: #e7f0ff;
            border: 1px solid #007BFF;
            padding: 15px;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            border-radius: 4px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            color: #777;
        }
        .footer a {
            color: #007BFF;
            text-decoration: none;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="header">
        <h1>Confirmation Code</h1>
    </div>
    <div class="content">
        <p>Dear User,</p>
        <p>Thank you for registering with us! Please find your confirmation code below:</p>
        <div class="code">${code}</div>
        <p>Please enter this code to complete your registration.</p>
        <p>If you did not request this email, please ignore it.</p>
    </div>
    <div class="footer">
        <p>&copy; 2024 Your Company. All rights reserved.</p>
        <p><a href="#">Contact Us</a> | <a href="#">Unsubscribe</a></p>
    </div>
</div>

</body>
</html>
`,
            });
            await User.findByIdAndUpdate(user._id, { codegenerated: code });
            return res.status(301).json("Nous avons envoyé un code pour activer votre compte.");
        }

        const token = jwt.sign({ id: user._id, role: user.Role }, process.env.secretOrPrivateKey);
        res.status(200).json({ result: user, token, message: "Sign in successful" });
    } catch (error) {
        console.log(error);
        
        res.status(400).json(error);
    }
});

router.get('/confirm/:code', async (req, res) => {
    try {
        const code = req.params.code;
        const user = await User.findOne({ codegenerated: code });

        if (user) {
            await User.findByIdAndUpdate(user._id, { confirmed: true, $unset: { codegenerated: 1 } });
            const token = jwt.sign({ id: user._id, role: user.Role }, process.env.scretorkey);
            res.status(200).json({ result: user, token, message: "Sign in successful." });
        }
    } catch (error) {
        res.status(500).json("Internal server error");
    }
});

router.post('/forgotpassword', async (req, res) => {
    try {
        const email = req.body.Email.toLowerCase().trim();
        const user = await User.findOne({ Email: email });

        if (!user) {
            return res.status(401).json("Check your email.");
        }

        const resetCode = Math.floor(Math.random() * (999999 - 100000) + 100000);
        await transporter.sendMail({
            from: 'groupe camp',
            to: user.Email,
            subject: 'Reset Your Password',
            html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #007BFF;
            color: white;
            padding: 10px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            margin: 0;
        }
        .content {
            padding: 20px;
        }
        .content p {
            font-size: 16px;
            line-height: 1.5;
        }
        .code {
            background-color: #e7f0ff;
            border: 1px solid #007BFF;
            padding: 15px;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            border-radius: 4px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            color: #777;
        }
        .footer a {
            color: #007BFF;
            text-decoration: none;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="header">
        <h1>Reset Your Password</h1>
    </div>
    <div class="content">
        <p>Dear User,</p>
        <p>We received a request to reset your password. Please find your reset link below:</p>
        <div class="code">{{resetLink}}</div>
        <p>Click the link above to create a new password.</p>
        <p>If you did not request this email, please ignore it.</p>
    </div>
    <div class="footer">
        <p>&copy; 2024 Your Company. All rights reserved.</p>
        <p><a href="#">Contact Us</a> | <a href="#">Unsubscribe</a></p>
    </div>
</div>

</body>
</html>
`,
        });

        await User.findByIdAndUpdate(user._id, { resetCode });
        return res.status(301).json("Nous avons envoyé un code pour changer votre mot de passe.");
    } catch (error) {
        res.status(400).json("Failed to send reset email.");
    }
});

router.post('/passwordReset/:code', async (req, res) => {
    try {
        const resetCode = req.params.code;
        const hashedPassword = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));
        
        const user = await User.findOneAndUpdate(
            { resetCode },
            { password: hashedPassword, $unset: { resetCode: 1 } },
            { new: true }
        );

        if (user) {
            res.status(200).json({ result: user, message: "Password changed successfully" });
        } else {
            res.status(404).json({ message: "User not found or invalid reset code" });
        }
    } catch (error) {
        res.status(500).json("Internal server error");
    }
});

router.put('/addUserToCategory', async (req, res) => {
    try {
        const { categoryId, userId } = req.body; 
        const category = await ServiceCategory.findById(categoryId);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        if (category.users.includes(userId)) {
            return res.status(400).json({ message: 'User is already part of this category' });
        }

        category.users.push(userId)
        await category.save(); 
       

        res.status(200).json({ message: 'User successfully added to the category', category});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;
