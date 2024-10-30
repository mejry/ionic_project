console.clear();

const User = require("../Models/user");
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        console.log('Database connected');

        const email = "admin@admin.com".toLowerCase().trim();
        const username = "younes_manita";
        let webmaster = await User.findOne({ Role: 'admin', username: "admin" });

        if (!webmaster) {
            let existingUser = await User.findOne({ Username: username });

            if (!existingUser) {
                let password = 'adminpassword';
                const salt = await bcrypt.genSalt(10);
                const hashed = await bcrypt.hash(password, salt);

                let new_user = new User({
                    FirstName: "younes",
                    username: "admin",
                    Gouvernerat: "Medenine",
                    Username: username,
                    Adresse: "Medenine",
                    LastName: "Manita",
                    Email: email,
                    password: hashed,
                    Role: 'admin',
                });

                await new_user.save();
                console.log(`Admin account has been added: ${new_user.Email}`);
            } else {
                console.log(`account admin "${email}" already exists.`);
            }
        } else {
            console.log(`Admin account already exists \n Admin email: ${webmaster.Email}`);
        }

    } catch (error) {
        console.log(error);
        console.log("Database connection failed");
    }
};

module.exports = connectDB;
