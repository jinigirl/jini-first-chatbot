const express = require('express');
const axios = require('axios');
// const odata = require('./Odata');
const bodyParser =  require('body-parser');
//const request = require('request');
//const parser = require('xml2json');

// set up web server
const app = express();
//const port = 5000;
let port = process.env.PORT || 5000;
app.use(bodyParser.json());
// app.use('/', odata);

//post request
app.post('/', (req, res) => {
   console.log(req.body.conversation);

    // let document = req.body.conversation.memory.document.value;
    // let service  = req.body.conversation.memory.service.value;
    // let number  = req.body.conversation.memory.number.scalar;

    //  console.log(`So you want me to ${service} ${document} document ${number}, huh? `);
    // let msg = `Webhook got the information. You want me to ${service} ${document} number ${number}.`;
    // res.send({
    //     replies:[{
    //         type : 'text',
    //         content : msg
        // }]
    // }); 


    // pass chatbot data as input

    let input = req.body.conversation.memory.number.scalar;
    let url = `http://vhs07.elabs.svcs.hpe.com:50000/sap/opu/odata/sap/ZBILLING_SRV/Billing_DocSet('${input}')?$format=json`;
    axios.all([
        axios.get(url,{
            auth: {
                username: 'zprovtest',
                password: 'Sarangh@31'
            },
        })
      ]).then(axios.spread((response) => {
      //  console.log(response1.data.url);
      //  console.table(response2.data);
          let delivery = response.data.d.DeliveryNum;
          let billing = response.data.d.BillingDoc;
      
          // console.log(response.data.d.DeliveryNum);
          // console.log(response.data.d.BillingDoc);
          // console.log(`Delivery document ${delivery} has corresponding billing document ${billing}.`);
          let result = `Delivery document ${delivery} has corresponding billing document ${billing}.`;
          //return result;
          // console.log(result);
        
    //return response to chatbot
          res.send({
            replies:[{
                type : 'text',
                content : result
            }]
          });

      })).catch(error => {
          console.log('There is error: ' + error);
    });

});

// error handling
app.post('/errors', (req, res) => {
    console.log(req.body)
    res.send(err)
});

    
// port
app.listen(port, () => {
   console.log('Server is listening to port ' + port); 
})