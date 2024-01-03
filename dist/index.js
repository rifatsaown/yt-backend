"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 3000;
app.get('/', (req, res) => {
    // const html = fs.readFileSync(path.resolve(__dirname, '../public/index.html'), 'utf-8');
    res.send(fs_1.default.readFileSync(path_1.default.resolve(__dirname, '../public/index.html'), 'utf-8'));
});
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map