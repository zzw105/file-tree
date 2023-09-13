#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var package_json_1 = __importDefault(require("./package.json"));
var fs_1 = __importDefault(require("fs"));
var util_1 = require("./util");
var findup_sync_1 = __importDefault(require("findup-sync"));
var path_1 = __importDefault(require("path"));
var fileStructure = /** @class */ (function () {
    function fileStructure() {
    }
    return fileStructure;
}());
var program = new commander_1.Command();
(function () {
    return __awaiter(this, void 0, void 0, function () {
        function sortDir(arr) {
            var i = arr.length - 1;
            while (i >= 0) {
                if (typeof arr[i] === 'object') {
                    var obj = arr.splice(i, 1);
                    arr.unshift(obj[0]);
                }
                i--;
            }
            return arr;
        }
        var directory, config, dirToJson, structureJson, fileCommentPath, fileComment, outputString, characters, addComment, drawDirTree;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // -v的显示
                    program.version(package_json_1.default.version);
                    directory = process.cwd();
                    config = (0, util_1.getConfig)();
                    dirToJson = function (path) {
                        var stats = fs_1.default.lstatSync(path);
                        var structure = {};
                        if (stats.isDirectory()) {
                            var dir = fs_1.default.readdirSync(path);
                            // if (ignoreRegex) {
                            //   dir = dir.filter((val) => {
                            //     return !ignoreRegex.test(val)
                            //   })
                            // }
                            var dirObj = dir.map(function (child) {
                                var childStats = fs_1.default.lstatSync(path + '/' + child);
                                return childStats.isDirectory() ? dirToJson(path + '/' + child) : child;
                            });
                            // const popPop = (arr: (string | fileStructure)[]) => {
                            //   if (arr.length === 0) return arr
                            //   if (typeof arr[arr.length - 1] !== 'string') {
                            //     const popObj = arr.pop() as fileStructure
                            //     arr.unshift(popObj)
                            //     if (typeof arr[arr.length - 1] !== 'string') {
                            //       popPop(arr)
                            //     }
                            //   }
                            //   return arr
                            // }
                            // if (dirObj.length > 0 && typeof dirObj[0] !== typeof dirObj[dirObj.length - 1]) {
                            //   dirObj = popPop(dirObj)
                            // }
                            var dirName = path.replace(/.*\/(?!$)/g, '');
                            structure[dirName] = sortDir(dirObj);
                        }
                        else {
                            var fileName = path.replace(/.*\/(?!$)/g, '');
                            return fileName;
                        }
                        return structure;
                    };
                    structureJson = dirToJson(directory);
                    if (typeof structureJson === 'string') {
                        console.log('此目标不是目录');
                        return [2 /*return*/];
                    }
                    fileCommentPath = (0, findup_sync_1.default)('file-tree/fileComment.json');
                    fileComment = (fileCommentPath && require(fileCommentPath)) || {};
                    outputString = '';
                    characters = {
                        border: '|',
                        contain: '├',
                        line: '─',
                        last: '└',
                    };
                    addComment = function (structureJson, path) { return __awaiter(_this, void 0, void 0, function () {
                        var key, arr, fileName, fileType, index, element, filePath, inputString;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    key = Object.keys(structureJson)[0];
                                    if (config.ignore.includes(key)) {
                                        delete structureJson[key];
                                        return [2 /*return*/];
                                    }
                                    arr = structureJson[key];
                                    fileName = '';
                                    fileType = '文件夹';
                                    index = 0;
                                    _a.label = 1;
                                case 1:
                                    if (!(index < arr.length)) return [3 /*break*/, 7];
                                    element = arr[index];
                                    if (!(typeof element === 'string')) return [3 /*break*/, 2];
                                    fileName = element;
                                    fileType = '文件';
                                    return [3 /*break*/, 4];
                                case 2:
                                    fileName = Object.keys(element)[0];
                                    return [4 /*yield*/, addComment(element, "".concat(path, "\\").concat(Object.keys(element)[0]))];
                                case 3:
                                    _a.sent();
                                    _a.label = 4;
                                case 4:
                                    if (!!config.ignore.includes(fileName)) return [3 /*break*/, 6];
                                    filePath = "".concat(path, "\\").concat(fileName);
                                    if (!(fileComment[filePath] === undefined)) return [3 /*break*/, 6];
                                    return [4 /*yield*/, (0, util_1.readLine)("\n\n\u8BF7\u8F93\u5165\u6B64".concat(fileType, "\u7684\u6CE8\u91CA\n").concat(filePath, "\n"))
                                        // const userText = iconv.decode(
                                        //   readlineSync.question(`\n\n请输入此${fileType}的注释\n${filePath}\n`, { encoding: 'gbk' }),
                                        //   'gbk'
                                        // )
                                    ];
                                case 5:
                                    inputString = _a.sent();
                                    // const userText = iconv.decode(
                                    //   readlineSync.question(`\n\n请输入此${fileType}的注释\n${filePath}\n`, { encoding: 'gbk' }),
                                    //   'gbk'
                                    // )
                                    fileComment[filePath] = inputString;
                                    _a.label = 6;
                                case 6:
                                    index++;
                                    return [3 /*break*/, 1];
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, addComment(structureJson, Object.keys(structureJson)[0])];
                case 1:
                    _a.sent();
                    fs_1.default.writeFileSync(path_1.default.join(directory, './file-tree/fileComment.json'), JSON.stringify(fileComment), 'utf8');
                    drawDirTree = function (structureJson, placeholder, path) {
                        var border = characters.border, contain = characters.contain, line = characters.line, last = characters.last;
                        for (var i in structureJson) {
                            if (Array.isArray(structureJson[i])) {
                                var filePath = "".concat(path);
                                var annotation = fileComment[filePath] ? ' // ' + fileComment[filePath] : '';
                                outputString += '\n' + placeholder + i + annotation;
                                placeholder = placeholder.replace(new RegExp("".concat(contain), 'g'), border);
                                placeholder = placeholder.replace(new RegExp("".concat(line), 'g'), ' ');
                                placeholder = placeholder + Array(Math.ceil(i.length / 2)).join(' ') + contain + line;
                                placeholder = placeholder.replace(new RegExp('^ +', 'g'), '');
                                structureJson[i].forEach(function (val, idx, arr) {
                                    var pl = placeholder;
                                    //if the idx is the last one, change the character
                                    if (idx === arr.length - 1) {
                                        var regex = new RegExp("".concat(contain).concat(line, "$"), 'g');
                                        pl = placeholder.replace(regex, last) + line;
                                    }
                                    var filePath = "".concat(path, "\\").concat(typeof val === 'string' ? val : Object.keys(val)[0]);
                                    var annotation = fileComment[filePath] ? ' // ' + fileComment[filePath] : '';
                                    if (typeof val === 'string') {
                                        outputString += '\n' + pl + val + annotation;
                                    }
                                    else {
                                        var pl_1 = placeholder;
                                        drawDirTree(val, pl_1, "".concat(path, "\\").concat(Object.keys(val)[0]));
                                    }
                                });
                            }
                        }
                    };
                    drawDirTree(structureJson, '', Object.keys(structureJson)[0]);
                    console.log(outputString);
                    fs_1.default.writeFileSync(path_1.default.join(directory, './file-tree/fileTree.md'), outputString);
                    process.exit();
                    return [2 /*return*/];
            }
        });
    });
})();
//# sourceMappingURL=index.js.map