require('dotenv').config();

const express =   require('express');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.get('',(req, res) => {
    res.send('Hola programadores moviles');
});


function validarEstudiante(tarea){
    if (!estudiante.nombre) throw new Error('Debe escribir el nombre')
}

app.use(express.json());

app.get('/api/estudiantes', async (req, res)=> {
    try {
        const estudiantes = await db('estudiantes').select();
        res.status(200).send(estudiantes);
    } catch (error){
        res.status(500).send({
           status:500,
           message: error.message
        });
    }
    
});


app.post('/api/estudiantes', async (req, res)=> {
    const nombre = req.body.nombre;
    const apellido = req.body.apellido; 
    const carrera = req.body.carrera; 
    const facultad = req.body.facultad; 
    const carnet = req.body.carnet;     
    if (!nombre) {
    return res.status(400).send({status:400, message: 'El nombre  del estudiante es requerido'});
    }else if (!apellido) {
    return res.status(400).send({status:400, message: 'El apellido es requerido'});
    }else if (!carrera){ 
    return res.status(400).send({status:400, message: 'El nombre de la carrera es requerido'});
    }else if (!facultad){ 
    return res.status(400).send({status:400, message: 'El nombre de la facultad es requerido'});
    }else if (!carnet){ 
    return res.status(400).send({status:400, message: 'El codigo de carnet del estudiante es requerido'});
    }else{
        try{
        const nuevoEstudiante = await db('estudiantes').insert({
            nombre:nombre,
            apellido:apellido,
            carrera : carrera,
            facultad:facultad,
            carnet:carnet
        }).returning('*');
        res.status(201).send(nuevoEstudiante[0]);
        }catch (error){
            res.status(500).send({
                status:500,
                message: error.message,
            });}    
    }
});

app.patch('/api/estudiantes/:id', async (req, res)=> {
    const id = Number(req.params.id) || -1; 
   try{
    const estudianteM = await db('estudiantes').first().where({id:id});
    if (!estudianteM) return res.status(404).send({status: 404, message: 'El estudiante con id ' +id+' no existe.',});

    const nombre = req.body.nombre;
    const apellido = req.body.apellido; 
    const carrera = req.body.carrera; 
    const facultad = req.body.facultad; 
    const carnet = req.body.carnet;

    if(nombre) estudianteM.nombre = nombre;
    if(apellido) estudianteM.apellido = apellido;
    if(carrera) estudianteM.carrera = carrera;
    if(facultad) estudianteM.facultad = facultad;
    if(carnet) estudianteM.carnet = carnet;

    const estudiantes = await db('estudiantes').update({nombre: estudianteM.nombre, apellido: estudianteM.apellido, carrera: estudianteM.carrera, 
        facultad: estudianteM.facultad , carnet: estudianteM.carnet}).where({id:id}).returning('*');
        res.status(200).send(estudiantes[0]);

   } catch(error){
    res.status(500).send({
        status:500,
        message: error.message,
    });
   }
});

app.delete('/api/estudiantes/:id', async (req, res)=> {
    const id = Number(req.params.id) || -1; 
   try{
    const estudianteD = await db('estudiantes').first().where({id:id});
    if (!estudianteD) return res.status(404).send({status: 404, message: 'El estudiante con id ' +id+' no existe.',});

    await db('estudiantes').delete().where({id:id});    
    res.status(204).send();

   } catch(error){
    res.status(500).send({
        status:500,
        message: error.message,
    });
   }
});

console.log('Testing');



app.listen(port, () => {
    console.log('Servidor escuchando en el puerto ' + port);
});

