const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const { profile } = require("console");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    
    res.sendFile(__dirname + "/index.html"); 
});

app.post("/", (req, res) => {
    const query = req.body.cityName;
    const apiKey = "xxxxxxxxxxxxxxxxxxxxxxx";
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apiKey+"&units=metric";
    
    https.get(url, (response) => {
        if (response.statusCode === 200) {
            
            response.on('data', (data) => {
                const weatherData = JSON.parse(data);
                const temp = weatherData.main.temp;
    
                const weatherDescription = weatherData.weather[0].description;
                const icon = weatherData.weather[0].icon;
                const imageURL = "http://openweathermap.org/img/wn/"+icon+"@2x.png";
                res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"})
                res.write("<h1>The Temperature in "+query+" is "+ temp +" degrees Celcius.</h1>");
                res.write(`<h3>The weather is currently ${weatherDescription} </h3>\n`);
                res.write(`<img src=${imageURL}>`)
                res.send();
            });    
        } else {
            res.send(`Either City name : "${query}" is Wrong \n<h3> or </h3>\n No data is Avaliable for the same\n<h1>Please Go Back</h1>`);
        }
        
        console.log(response.statusCode);
    });
});

app.listen(process.env.PORT || 3000, () => console.log("Server Started at port 3000")); 