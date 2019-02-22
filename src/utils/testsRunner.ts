import { Repl } from 'waves-repl';
import { waitForTx } from '@waves/waves-transactions';

let iframe: any = null;
let iframeDocument: any = null;
let iframeWindow: any = null;

const replCommands = Repl.Commands;

const addToGlobalScope = (key: string, value: any) => {
    iframeWindow[key] = value;
};

const addIframe = () => {
    iframe = document.createElement('iframe');
    iframe.width = iframe.height = 1;
    iframe.style.opacity = 0;
    iframe.style.border = 0;
    iframe.style.position = 'absolute';
    iframe.style.top = '-100px';
    iframe.setAttribute('name', 'testsRunner');
    document.body.appendChild(iframe);

    iframeDocument = iframe.contentDocument;
    iframeWindow = iframe.contentWindow;
};

const addScript = (src: string, name: string) => {
    return new Promise(function(resolve, reject) {
        let script = document.createElement('script');
        script.src = src;
        script.type = 'text/javascript';
        script.defer = true;
        script.id = name;
        iframeDocument.body.appendChild(script);

        script.onload = () => resolve();

        script.onerror = () => reject();
    });
};

const bindReplAPItoRunner = () => {
    const consoleAPI = Repl.API;

    try {
        Object.keys(consoleAPI)
            .forEach(key => addToGlobalScope(key, consoleAPI[key]));
    } catch (e) {
        console.error(e);
    }
};

const bindWavesTransactionsToRunner = () => {
    try {
        addToGlobalScope('waitForTx', waitForTx); 
    } catch (e) {
        console.error(e);
    }
};

const testReporter = (runner: any) => {
    let passes = 0;
    let failures = 0;
    
    runner.on('pass', (test: any) => {
        passes++;

        console.log(`pass: ${test.fullTitle()}`);

        // replCommands.log(`pass: ${test.fullTitle()}`);
    });

    runner.on('fail', (test: any, err: any) => {
        failures++;

        console.log(`fail: ${test.fullTitle()}, error: ${err.message}`);
        // replCommands.log(`fail: ${test.fullTitle()}, error: ${err.message}`);
    });

    runner.on('end', () => {
        console.log(`end: ${passes}/${passes + failures}`);
        // replCommands.log(`end: ${passes}/${passes + failures}`);
    });
};

const configureMocha = () => {
    iframeWindow.mocha.setup({
        ui: 'bdd',
        reporter: testReporter
    });
};

let configureRunner = async () => {
    return Promise.all([
        addScript('https://cdn.rawgit.com/mochajs/mocha/2.2.5/mocha.js', 'mocha'),
        addScript('https://cdnjs.cloudflare.com/ajax/libs/chai/4.2.0/chai.min.js', 'chai')
    ]).then(() => {
        configureMocha();
    });
};

const addTest = (code: string) => {
    addToGlobalScope('test', code);
};

let createRunner = (accounts: string[]) => {
    addIframe();

    bindReplAPItoRunner();

    bindWavesTransactionsToRunner();

    addToGlobalScope('accounts', accounts);

    configureRunner();
};

const runTest = async () => {   
    if (iframeWindow.test) {
        iframeDocument.getElementById('mocha')!.remove();

        delete iframeWindow.describe;
        delete iframeWindow.it;
        delete iframeWindow.mocha;
    }

    await configureRunner();

    try {
        iframeWindow.eval(iframeWindow.test);

        iframeWindow.mocha.run();
    } catch (error) {
        replCommands.error(error);
    }
};

export {
    createRunner,
    addTest,
    runTest
};
