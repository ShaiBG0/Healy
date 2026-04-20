require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const prisma = new PrismaClient();

const SECRET_KEY = process.env.SECRET_KEY;
const PUERTO = process.env.PUERTO;

app.use(cors({
    origin: process.env.URL_FRONT
}));
app.use(express.json());


app.post('/api/registro', async(req, res) =>{
    try{
        const passwordEnciptada = await bcrypt.hash(req.password, 10);
        const nuevoFisio = await prisma.fisioterapeuta.create({
            data: { nombre: req.body.nombre,
                    correo: req.body.correo, 
                    password: passwordEnciptada
            }
        })
        res.status(201).json({ mensaje: "Fisioterapeuta registrado con éxito" });
    }catch(error){
        res.status(400).json({ error: "El correo ya está en uso"})
    }
});

app.post('/api/login', async(req, res)=>{
    try{
        const fisioterapeuta = await prisma.fisioterapeuta.findUnique({
            where: { correo: req.body.correo }
        })

        if(!fisioterapeuta){
            return res.status(401).json({error: "Usuario no encontrado"});
        }

        const passwordValida = await prisma.bcrypt.compare(req.body.password, fisioterapeuta.password);
        
        if(!passwordValida){
            return res.status(401).json({error: "Contraseña incorrecta"})
        }

        const token = jwt.sign({idFisioterapeuta: fisioterapeuta.id}, SECRET_KEY, {expiresIn: '15m'});
        const refreshToken = jwt.sign({idFisioterapeuta: fisioterapeuta.id}, SECRET_KEY, {expiresIn: '7d'});

        await prisma.fisioterapeuta.update({
            where: {id: fisioterapeuta.id},
            data: {refreshToken: refreshToken}
        });

        res.json({mensaje: "Login exitoso", accessToken: accessToken, refreshToken: refreshToken});

    }catch(error){
        return res.status(500).json({error: "Error en el servidor"})
    }
});

/*
app.post('/api/refresh-token', async (req, res) => {//estudiar
    try {
        const { token } = req.body; 

        if (!token) {
            return res.status(401).json({ error: "No se proporcionó token de refresco" });
        }

        const fisioterapeuta = await prisma.fisioterapeuta.findFirst({
            where: { refreshToken: token }
        });

        if (!fisioterapeuta) {
            return res.status(403).json({ error: "Refresh token inválido o sesión cerrada" });
        }

        jwt.verify(token, process.env.REFRESH_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: "Refresh token expirado" });
            }

            const nuevoAccessToken = jwt.sign(
                { idFisioterapeuta: fisioterapeuta.id }, 
                process.env.SECRET_KEY, 
                { expiresIn: '15m' }
            );

            res.json({ accessToken: nuevoAccessToken });
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error en el servidor" });
    }
});

app.post('/api/logout', async (req, res) => {//estudiar
    try {
        const { idFisioterapeuta } = req.body; 
        
        await prisma.fisioterapeuta.update({
            where: { id: idFisioterapeuta },
            data: { refreshToken: null }
        });

        res.json({ mensaje: "Sesión cerrada correctamente" });
    } catch (error) {
        return res.status(500).json({ error: "Error al cerrar sesión" });
    }
});
*/

app.listen(PUERTO, ()=>{
    console.log(`Servidor corrienod en el puerto ${PUERTO}`);
});