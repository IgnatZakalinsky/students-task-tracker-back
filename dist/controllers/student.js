"use strict";
// const {addUserMongo, getUsersMongo, deleteUsersMongo, getUsersMongoById, updateUsersMongo} = require("./mongoRep");
// let {getUsers, addUser} = require('./rep.js');
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    //let result = await addUser(req.body.name);
    // await addUserMongo(req.body.name);
    if (!req.body.sessionToken) {
        res.send(JSON.stringify({ error: 'where is sessionToken?' }));
    }
    else if (!req.body.name || req.body.name.length < 8) {
        res.send(JSON.stringify({ error: 'name.length must be 7+' }));
    }
    else {
        const session = store.sessions.find(s => s.sessionToken === req.body.sessionToken);
        if (!session) {
            res.send(JSON.stringify({ error: 'bad sessionToken' }));
        }
        else if (session.finishSession) {
            res.send(JSON.stringify({ error: 'session is finished' }));
        }
        else {
            const token = uuidv1();
            session.students.push({
                studentToken: token,
                name: req.body.name,
                currentTaskNumber: 0,
            });
            const answer = {
                studentToken: token,
                taskCount: session.taskCount,
                name: req.body.name,
                currentTaskNumber: 0,
            };
            res.send(JSON.stringify(answer));
        }
    }
}));
router.put('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    //let result = await addUser(req.body.name);
    // await addUserMongo(req.body.name);
    if (!req.body.sessionToken) {
        res.send(JSON.stringify({ error: 'where is sessionToken?' }));
    }
    else {
        const session = store.sessions.find(s => s.sessionToken === req.body.sessionToken);
        if (!session) {
            res.send(JSON.stringify({ error: 'bad sessionToken' }));
        }
        else if (session.finishSession) {
            res.send(JSON.stringify({ error: 'session is finished' }));
        }
        else if (req.body.currentTaskNumber === undefined
            || req.body.currentTaskNumber < 0 || req.body.currentTaskNumber > session.taskCount) {
            res.send(JSON.stringify({
                taskCount: session.taskCount,
                error: 'bad currentTaskNumber: [' + req.body.currentTaskNumber
                    + '] - must  be between -1 and ' + (session.taskCount + 1),
            }));
        }
        else if (!req.body.studentToken) {
            res.send(JSON.stringify({ taskCount: session.taskCount, error: 'where is studentToken?' }));
        }
        else {
            const student = session.students.find(s => s.studentToken === req.body.studentToken);
            if (!student) {
                res.send(JSON.stringify({
                    error: "session don't have student with your studentToken"
                }));
            }
            else if (req.body.name > 0 && req.body.name.length < 8) {
                res.send(JSON.stringify({ taskCount: session.taskCount, error: 'name.length must be 7+' }));
            }
            else if (!req.body.name) {
                const answer = {
                    taskCount: session.taskCount,
                    name: student.name,
                    currentTaskNumber: student.currentTaskNumber,
                };
                res.send(JSON.stringify(answer));
            }
            else {
                session.students = session.students.map(s => s.studentToken === req.body.studentToken
                    ? Object.assign(Object.assign({}, s), { name: req.body.name, currentTaskNumber: req.body.currentTaskNumber }) : s);
                const answer = {
                    taskCount: session.taskCount,
                    name: req.body.name,
                    currentTaskNumber: req.body.currentTaskNumber,
                };
                res.send(JSON.stringify(answer));
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
//# sourceMappingURL=student.js.map