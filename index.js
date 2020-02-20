const express = require('express');
const server = express();

server.use(express.json());

let projects = [{ id: "1", title: "New project", tasks: []}];
let requests = 0;

// MIDDLEWARES

function checkIdAlreadyExists(req, res, next) {
    const { id } = req.body;

    if (!projects.find(p => p.id === id)) {
        return next();
    }

    return res.status(400).json({ error: "Project ID already exists"} );
}

function checkProjectExists(req, res, next) {
    const { id } = req.params;
    const exists =  projects.filter(p => p.id === id);
    
    if (!exists) {
        return res.status(400).json({ error: "Project does not exist"});
    }

    return next();
}

function countRequest(req, res, next) {
    requests += 1;
    console.log(`Requests: ${requests}`);
    return next();
}

// ROUTERS

server.get('/projects', countRequest, (req, res) => {
    return res.json(projects);
});

server.post('/projects', checkIdAlreadyExists, countRequest, (req, res) => {
    const { id, title, tasks } = req.body;
    
    projects.push({ id, title, tasks });

    return res.json(projects);
});

server.put('/projects/:id', checkProjectExists, countRequest, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    
    projects = projects.map(p => {
        if (p.id === id) {
            p.title = title;
        }
        return p;
    });

    return res.json(projects);
});

server.delete('/projects/:id', checkProjectExists, countRequest, (req, res) => {
    const { id } = req.params;
    
    projects.forEach((p, key) => {
        if (p.id === id) {
            projects.splice(key, 1);
        }
    });

    return res.send();
});

server.post('/projects/:id/tasks', checkProjectExists, countRequest, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    
    projects = projects.map(p => {
        if (p.id === id) {
            p.tasks.push(title);
        }
        return p;
    });

    return res.json(projects);
});


server.listen(3000, () => {
    console.log('Server ON');
});