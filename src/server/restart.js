const { spawn } = require('child_process');

const app = spawn('npm', ['run', 'start'], {
    detached: true,
    stdio: 'inherit'
});

app.unref();