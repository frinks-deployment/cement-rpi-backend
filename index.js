import express from 'express';
import { createServer } from 'http';
import bodyParser from 'body-parser';
import constants from './constants.js';
import { spawn } from 'child_process';

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

const httpServer = createServer(app);

app.post("/hooter-alert", (req,res)=> {
  try {
    const {relay, timeout} = req.body;
    spawn(`usbrelay ${relay}=1`, {shell: true});
    setTimeout(() => {
      spawn(`usbrelay ${relay}=0`, {shell: true});
    }, timeout);
    res.send("OK");
  } catch (error) {
    console.error(`error -- ${error}`);
    res.send("OK");
  }
});

httpServer.listen(constants.PORT, async err => {
if (err) {
    console.log('Cannot run!');
} else {
    console.log(`API server listening on port: ${constants.PORT}`);
}
});

export default app;
