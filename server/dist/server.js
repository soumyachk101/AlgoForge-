"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const auth_1 = __importDefault(require("./routes/auth"));
const problems_1 = __importDefault(require("./routes/problems"));
const submissions_1 = __importDefault(require("./routes/submissions"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use('/api/auth', auth_1.default);
app.use('/api/problems', problems_1.default);
app.use('/api/submissions', submissions_1.default);
app.get('/', (_req, res) => {
    res.send('AlgoForge API is running');
});
if (process.env.NODE_ENV !== 'production') {
    const server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
    process.on('SIGTERM', () => {
        console.log('SIGTERM signal received: closing HTTP server');
        server.close(() => {
            console.log('HTTP server closed');
        });
    });
}
exports.default = app;
//# sourceMappingURL=server.js.map