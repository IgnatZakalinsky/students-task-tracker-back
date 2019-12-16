"use strict";
// const {addUserMongo, getUsersMongo, deleteUsersMongo, getUsersMongoById, updateUsersMongo} = require("./mongoRep");
// let {getUsers, addUser} = require('./rep.js');
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// @ts-ignore
const uuidv1 = require('uuid/v1');
// @ts-ignore
const express = require('express');
// @ts-ignore
const store = require('./../bd/fake');
// @ts-ignore
const router = express.Router();
// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now(), store);
    next();
});
// for dev
router.get('/store', (req, res) => __awaiter(this, void 0, void 0, function* () {
    if (store)
        res.send(JSON.stringify(store));
    else
        res.send(404);
}));
router.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(req.query);
    //let result = await addUser(req.body.name);
    // await addUserMongo(req.body.name);
    if (!req.query.authorToken) {
        res.send(JSON.stringify({ error: 'where is authorToken?' }));
    }
    else {
        const session = store.sessions.find(s => s.authorToken === req.query.authorToken);
        if (!session) {
            res.send(JSON.stringify({ error: 'bad authorToken' }));
        }
        else if (session.finishSession) {
            res.send(JSON.stringify({ error: 'session is finished' }));
        }
        else {
            const answer = {
                sessionToken: session.sessionToken,
                taskCount: session.taskCount,
                students: session.students
            };
            res.send(JSON.stringify(answer));
        }
    }
}));
router.post('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(req.body);
    //let result = await addUser(req.body.name);
    // await addUserMongo(req.body.name);
    if (Number(req.body.taskCount)) {
        const tokenS = uuidv1();
        const tokenA = uuidv1();
        store.sessions.push({
            sessionToken: tokenS,
            authorToken: tokenA,
            startDate: new Date(),
            taskCount: req.body.taskCount,
            finishSession: false,
            students: [],
        });
        const answer = {
            sessionToken: tokenS,
            authorToken: tokenA,
        };
        res.send(JSON.stringify(answer));
    }
    else {
        res.send(JSON.stringify({ error: 'where is taskCount? (must be number)' }));
    }
}));
router.put('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(req.body);
    //let result = await addUser(req.body.name);
    // await addUserMongo(req.body.name);
    if (!req.query.authorToken) {
        res.send(JSON.stringify({ error: 'where is authorToken?' }));
    }
    else {
        const session = store.sessions.find(s => s.authorToken === req.query.authorToken);
        if (!session) {
            res.send(JSON.stringify({ error: 'bad authorToken' }));
        }
        else if (session.finishSession) {
            res.send(JSON.stringify({ error: 'session is finished' }));
        }
        else {
            const answer = Object.assign({}, session, { taskCount: req.body.taskCount, finishSession: req.body.finishSession });
            if (Number(req.body.taskCount) || req.body.finishSession) {
                store.sessions = store.sessions.map(s => s.authorToken === answer.authorToken ? answer : s);
                res.send(JSON.stringify(answer));
            }
            else {
                res.send(JSON.stringify({ error: 'where is taskCount? (must be number)' }));
            }
        }
    }
}));
// router.get('/:id', async (req, res) => {
//     let users = await getUsersMongoById(req.params.id);
//
//     console.log(req.params.id);
//     if (users) res.send(JSON.stringify(users));
//     else res.send(404);
// });
// router.get('/', async (req, res) => {
//     let users;
//     if (req.query.name) {
//         //users = [users.find(u => u.name === req.query.name)];
//         users = await getUsersMongo(req.query.name);
//
//         console.log('qery: ' + req.query.name);
//     } else {
//         //let users = await getUsers();
//         users = await getUsersMongo();
//     }
//
//     console.log(users);
//     res.send(JSON.stringify(users));
// });
// router.delete('/:id', async (req, res) => {
//     await deleteUsersMongo(req.params.id);
//
//     console.log(req.params.id);
//     res.send(204);
// });
// router.post('/login', async (req: any, res: any) => {
//     console.log(req.body);
//     //let result = await addUser(req.body.name);
//     // await addUserMongo(req.body.name);
//     const answer = store.login(req.body.email, req.body.password, req.body.rememberMe);
//
//     res.send(JSON.stringify(answer));
// });
// router.put('/', async (req, res) => {
//     console.log(req.body.name);
//     //let result = await addUser(req.body.name);
//     await updateUsersMongo(req.body.id, req.body.name);
//     res.send(JSON.stringify({success: true}));
// });
module.exports = router;
//# sourceMappingURL=session.js.map