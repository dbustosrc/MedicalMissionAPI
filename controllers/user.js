'use strict'

const User = require('../models/user');
const bcrypt = require('../node_modules/bcrypt-nodejs');
const jwt = require('../services/jwt');
const fs = require('fs/promises');
const path = require('path');

async function saveUser(req, res) {
    try {
        const { name, surname, email, phonenumber, password } = req.body;

        const user = new User({
            name,
            surname,
            email,
            phonenumber,
            role: 'ROLE_USER',
            image: 'null'
        });

        if (password) {
            bcrypt.hash(password, null, null, function (err, hash) {
                user.password = hash;
            });
        } else {
            return res.status(400).send({ error: 'Ingrese una contraseña' });
        }

        if (!name || !surname || !email || !phonenumber) {
            return res.status(400).send({ error: 'Ingrese todos los campos' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).send({ error: 'El correo ya existe' });
        }

        const result = await user.save();
        res.status(200).send({ user: result });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

async function getUser(req, res) {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userRecord = {
            _id: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email
        };
        res.json(userRecord);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getUsers(req, res) {
    try {
        const users = await User.find();
        const userRecords = users.map(user => ({
            _id: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email
        }));
        res.json(userRecords);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function loginUser(req, res) {
    try {
        const { email, password, gethash } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() }).exec();
        if (!user) {
            return res.status(500).send({ error: 'El usuario no existe' });
        }

        const validPassword = await comparePasswords(password, user.password);
        if (!validPassword) {
            return res.status(500).send({ error: 'El usuario no ha podido loguearse' });
        }

        if (gethash) {
            const token = jwt.createToken(user);
            console.log(token);
            return res.status(200).send({ token });
        }

        return res.status(200).send({ user });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: err.message });
    }
}

function comparePasswords(password, hashedPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hashedPassword, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

async function updateUser(req, res) {
    try {
        const userId = req.params.id;
        const update = req.body;

        if (userId !== req.user.sub) {
            return res.status(500).send({ error: 'No se puede actualizar un usuario diferente al actual' });
        }

        const userUpdated = await User.findByIdAndUpdate(userId, update).exec();
        if (!userUpdated) {
            return res.status(500).send({ error: 'No se ha podido actualizar el usuario' });
        }

        return res.status(200).send({ user: userUpdated });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ error: err.message });
    }
}

async function uploadImage(req, res) {
    try {
        const userId = req.params.id;

        if (!req.files) {
            return res.status(500).send({ error: 'No ha subido ninguna imagen' });
        }

        const imageFile = req.files.image;
        const filePath = imageFile.path;
        const fileName = filePath.split(/[\\/]/).pop();
        const fileExt = fileName.split('.').pop().toLowerCase();

        if (fileExt !== 'png' && fileExt !== 'jpg' && fileExt !== 'gif') {
            return res.status(500).send({ error: 'Extensión del archivo no válida' });
        }

        const userUpdated = await User.findByIdAndUpdate(userId, { image: fileName }).exec();
        if (!userUpdated) {
            return res.status(500).send({ error: 'No se ha podido actualizar el usuario' });
        }

        return res.status(200).send({ image: fileName, user: userUpdated });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ error: err.message });
    }
}

async function getImageFile(req, res) {
    try {
        const imageFile = req.params.imageFile;
        const filePath = path.resolve('./uploads/users/', imageFile);
        const fileExists = await fs.access(filePath).then(() => true).catch(() => false);

        if (fileExists) {
            res.sendFile(filePath);
        } else {
            res.status(500).send({ error: 'La imagen no existe' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: err.message });
    }
}

async function updatePassword(req, res) {
    try {
      const { email, newPassword } = req.body;
  
      // Verificar si se proporcionan el correo electrónico y las contraseñas
      if (!email || !newPassword) {
        return res.status(400).send({ error: 'Ingrese todos los campos' });
      }
  
      // Buscar al usuario por su correo electrónico
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).send({ error: 'Usuario no encontrado' });
      }

      // Generar un nuevo hash para la nueva contraseña
      bcrypt.hash(newPassword, null, null, async function (err, hash) {
        if (err) {
          return res.status(500).send({ error: 'Error al generar el hash de la contraseña' });
        }
  
        // Actualizar la contraseña del usuario
        user.password = hash;
        const result = await user.save();
  
        res.status(200).send({ user: result });
      });
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  }
  

module.exports = {
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile,
    updatePassword
};