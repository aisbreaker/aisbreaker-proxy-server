import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'

import { ping, version as getVersion } from './rest-api/controllers/greeting.js'
import { task } from './rest-api/controllers/ais.js'

/*
import jwt from 'express-jwt'
import jwksRsa from 'jwks-rsa'
*/

//
// basic settings
//
const app = express()
const port = 3000
const version = "0.0.1"

const basePath = "/api/v1"

//
// start server (async)
//
async function startServer() {
    //
    // init expressjs
    //
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cors())
  
    // enable logging (https://github.com/expressjs/morgan)
    app.use(morgan('combined'))
  
    /*
    const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://your-auth0-domain.auth0.com/.well-known/jwks.json'
    }),

    audience: 'your-audience',
    issuer: 'https://your-auth0-domain.auth0.com/',
    algorithms: ['RS256']
    })
    */

    //
    // define routes (expressjs)
    //

    // deliver some static content (root webapp)
    app.get('/', cors(), (req, res) => {
        res.send('Hello from AIsBreaker Proxy Server ... Details on AIsBreaker.org ...')
    })

    app.get('/info', cors(), (req, res) => {
        getInfoString().then(resultStr => {
            res.send(""+resultStr);
        })
    })


    /*
    // the home page and more - with required authentication
    app.use(basePath+"/", [ensureAuthenticated, express.static(baseDir+"/webapps/root")]);
    app.get(basePath+"/hello", ensureAuthenticated, function (req, res) {
      console.log("req.sessionID=", req.sessionID);
      res.send("Hello Chris! ("+addFunc(1, 2)+", "+(new Date())+")");
    });
    */

    // API
    app.get(basePath + "/ping", cors(), (req, res) => {
        ping(req, res)
    })

    app.get(basePath + '/version', cors(), (req, res) => {
        getVersion(req, res, version)
    })

    app.post(basePath + '/task', cors(), /*checkJwt,*/(req, res) => {
        task(req, res)
    })

    //
    // start the web server now
    //
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    })

}
startServer()


//
// experiments
//

export async function getInfoString(): Promise<string>{
  return `<!DOCTYPE html>
    <html>
      <body>

        Links:<br>
        <a href="/api/v1/version" target="_blank">Version</a><br>

        <br><br>

        <br><br>

      </body>
    </html>
  `
}
