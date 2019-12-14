"use strict";
// @ts-ignore
const store = {
    sessions: [
        {
            authorToken: 'devTestSessionToken',
            startDate: new Date(),
            taskCount: 17,
            finishSession: false,
            students: [
                {
                    studentToken: 'devTestStudentToken',
                    name: 'devTestStudentName',
                    currentTaskNumber: 7,
                }
            ],
        },
    ],
};
module.exports = store;
//# sourceMappingURL=fake.js.map