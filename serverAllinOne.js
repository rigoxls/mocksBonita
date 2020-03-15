const express = require('express');
const bodyParser = require('body-parser');
const { WebClient } = require('@slack/web-api');
const app = express();
const port = 5001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/generate_questions', (req, res) => {
    const cedula = req.query.cedula;

    let response = {
        question_1: '',
        question_2: '',
        question_3: ''
    };
    
    switch(cedula) {
        case '1110454083':
            response = {
                question_1: '¿Cuál es el primer nombre de su abuela materna?',
                question_2: '¿En qué entidad bancaria obtuvo su primer crédito?',
                question_3: '¿Cuál es el número de su primera línea telefónica?'
            }
        break;

        case '1110454084':
        case '1110454085':
            response = {
                question_1: '¿Cuál es el primer apellido de su abuelo paterno?',
                question_2: '¿Cuál es la marca de su primer vehículo?',
                question_3: '¿Cuál es Ciudad de nacimiento de su hermano mayor?'
            }
        break;        
    }

    res.json(response);
});

app.get('/validate_answers', (req, res) => {
    const cedula = req.query.cedula;
    const answer_1 = req.query.answer_1.toLowerCase();
    const answer_2 = req.query.answer_2.toLowerCase();
    const answer_3 = req.query.answer_3.toLowerCase();

    let response = "false";
    
    switch(cedula) {
        case '1110454083':
            if(answer_1 == 'maria' && answer_2 == 'bancolombia' && answer_3 == '3203769881'){
                response = true;
            }
        break;

        case '1110454084':
        case '1110454085':
            if(answer_1 == 'marcos' && answer_2 == 'yamaha' && answer_3 == 'julian'){
                response = true;
            }
        break;        
    }

    res.json({validated: response});
});

app.get('/validate_listas_negras', (req, res) => {
    const cedula = req.query.cedula;

    let response = "false";
    
    switch(cedula) {
        case '1110454083':            
            response = 'true';
        break;

        case '1110454084':            
            response = 'false';
        break;

        case '1110454085':            
            response = 'true';
        break;        
    }

    res.json({validated: response});
});

app.get('/verificar_perfil_riesgo', (req, res) => {
    const cedula = req.query.cedula;

    let perfil = "riesgoso";
    
    switch(cedula) {
        case '1110454083':            
        perfil = 'riesgoso';
        break;

        case '1110454085':            
        perfil = 'no riesgoso';
        break;        
    }

    res.json({perfil});
});

app.get('/send_message_slack', (req, res) => {
const nombres = req.query.nombres;
const apellidos = req.query.apellidos
;
const web = new WebClient("xoxb-1000955560885-1003154792966-8EETkD3d46PUxUS9D26hrgVi");
(async () => {

  try {    
    await web.chat.postMessage({
      channel: '#bonitaSoft',
      text: `Estimado usuario ${nombres} ${apellidos},
      Colfondos le informa que el estado de su solicitud de registro en línea 
      fue aprobado.
      
      Gracias por confiar en nuestros servicios.`,
    });
  } catch (error) {
    console.log(error);
  }

  console.log('Message posted!');
})();

    res.json({});
});

app.listen(port, () => {
    console.log('Servicio de mocks');
});
