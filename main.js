/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 22);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_model_profile__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_model_attribute__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_model_skill__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_model_character__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_model_status__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_view_page__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_view_dice_image__ = __webpack_require__(23);







const status = new __WEBPACK_IMPORTED_MODULE_4_model_status__["b" /* StatusManager */](new __WEBPACK_IMPORTED_MODULE_0_model_profile__["a" /* ProfileManager */](), new __WEBPACK_IMPORTED_MODULE_1_model_attribute__["c" /* AttributeManager */](), new __WEBPACK_IMPORTED_MODULE_2_model_skill__["c" /* SkillManager */](), new __WEBPACK_IMPORTED_MODULE_3_model_character__["a" /* CharacterManager */]());
/* harmony export (immutable) */ __webpack_exports__["a"] = status;

const navigation = new __WEBPACK_IMPORTED_MODULE_5_view_page__["a" /* PageManager */]('home');
/* harmony export (immutable) */ __webpack_exports__["b"] = navigation;

class Resources {
    get diceImage() { return (this._diceImage || (this._diceImage = this.getDiceImage())); }
    get diceSound() { return (this._diceSound || (this._diceSound = this.getDiceSound())); }
    getDiceImage() {
        return new __WEBPACK_IMPORTED_MODULE_6_view_dice_image__["a" /* default */](document.getElementById("dice-image"));
    }
    getDiceSound() {
        return document.getElementById("dice-sound");
    }
}
const resources = new Resources();
/* harmony export (immutable) */ __webpack_exports__["c"] = resources;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["c"] = generateUUID;
/* unused harmony export toHexString */
/* harmony export (immutable) */ __webpack_exports__["a"] = getSHA256;
/* harmony export (immutable) */ __webpack_exports__["b"] = requestJSON;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_fast_sha256__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_fast_sha256___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_fast_sha256__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stablelib_utf8__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stablelib_utf8___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__stablelib_utf8__);


const UUID_VERSION_4 = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
const UUID_REGEXP = /[xy]/g;
function generateUUID() {
    return UUID_VERSION_4.replace(UUID_REGEXP, ch => {
        const random = Math.random() * 16 | 0;
        const value = (ch === 'x' ? random : (random & 0x03 | 0x08));
        return value.toString(16);
    });
}
function toHexString(bytes) {
    return Array.from(bytes).map(x => ("00" + x.toString(16)).slice(-2)).join('');
}
function getSHA256(data) {
    return toHexString(__WEBPACK_IMPORTED_MODULE_0_fast_sha256___default()(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__stablelib_utf8__["encode"])(data)));
}
function requestJSON(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('GET', url);
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.response);
            }
            else {
                reject(new Error(xhr.statusText));
            }
        };
        xhr.onerror = () => {
            reject(new Error(xhr.statusText));
        };
        xhr.send();
    });
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__input__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__skill__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__item__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__operation__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__utility__ = __webpack_require__(1);





class Character {
    constructor(...args) {
        if (args.length >= 1 && typeof args[0] === 'object') {
            const data = args[0];
            const uuid = args[1];
            this.uuid = String(uuid !== undefined ? uuid : (data.uuid || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__utility__["c" /* generateUUID */])()));
            this.profile = String(data.profile);
            this.inputs = new __WEBPACK_IMPORTED_MODULE_0__input__["c" /* InputDataSet */](data.inputs);
            this.points = new __WEBPACK_IMPORTED_MODULE_1__skill__["d" /* SkillPointSet */](data.points);
            this.items = Array.from(data.items || []).map(x => new __WEBPACK_IMPORTED_MODULE_2__item__["a" /* Item */](x));
            this.history = new __WEBPACK_IMPORTED_MODULE_3__operation__["b" /* History */](data.history);
            this.visible = (data.visible !== undefined ? Boolean(data.visible) : true);
        }
        else {
            const profile = args[0];
            this.uuid = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__utility__["c" /* generateUUID */])();
            this.profile = profile;
            this.inputs = new __WEBPACK_IMPORTED_MODULE_0__input__["c" /* InputDataSet */]();
            this.points = new __WEBPACK_IMPORTED_MODULE_1__skill__["d" /* SkillPointSet */]();
            this.items = [];
            this.history = new __WEBPACK_IMPORTED_MODULE_3__operation__["b" /* History */]();
            this.visible = true;
        }
    }
    toJSON() {
        return {
            uuid: this.uuid,
            profile: this.profile,
            inputs: this.inputs,
            points: this.points,
            items: this.items,
            history: this.history,
            visible: this.visible,
        };
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = Character;

class CharacterManager {
    constructor() {
        this._table = Object.create(null);
        this._listeners = [];
    }
    contains(uuid) {
        return (uuid in this._table);
    }
    get(uuid) {
        return this._table[uuid];
    }
    list() { return Object.keys(this._table).map(x => this._table[x]); }
    add(character) {
        const updated = this.contains(character.uuid);
        this._table[character.uuid] = character;
        this.raiseListChangedEvent(updated ? 'update' : 'add', character);
    }
    remove(character) {
        if (this.get(character.uuid) === character) {
            delete this._table[character.uuid];
            this.raiseListChangedEvent('remove', character);
        }
    }
    import(data) {
        if (Array.isArray(data)) {
            for (const character of data) {
                this.add(new Character(character));
            }
        }
    }
    refresh(character) {
        if (this.get(character.uuid) === character) {
            this.raiseListChangedEvent('update', character);
        }
    }
    addListener(listener) {
        this._listeners.push(listener);
    }
    removeListener(listener) {
        const index = this._listeners.lastIndexOf(listener);
        if (index !== -1)
            this._listeners.splice(index, 1);
    }
    [Symbol.iterator]() {
        return this.list()[Symbol.iterator]();
    }
    raiseListChangedEvent(operation, target) {
        for (const listener of this._listeners) {
            listener.onCharacterListChanged(operation, target);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CharacterManager;



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return DiceRollEventType; });
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var DiceRollEventType;
(function (DiceRollEventType) {
    DiceRollEventType[DiceRollEventType["Start"] = 0] = "Start";
    DiceRollEventType[DiceRollEventType["Stop"] = 1] = "Stop";
    DiceRollEventType[DiceRollEventType["Update"] = 2] = "Update";
})(DiceRollEventType || (DiceRollEventType = {}));
class DiceManager {
    constructor() {
        this.interval = 100;
        this.duration = 1000;
        this._current = null;
        this._diceSets = Object.create(null);
        this._listeners = [];
        this._rolling = false;
    }
    get current() { return this._current; }
    get diceSet() { return ((this._current !== null && this._diceSets[this._current]) || null); }
    register(id, diceSet) {
        this._diceSets[id] = diceSet;
        if (this._current === id) {
            this.raiseDiceSetChangedEvent();
        }
    }
    unregister(id) {
        delete this._diceSets[id];
        if (this._current === id) {
            this._current = null;
            this.raiseDiceSetChangedEvent();
        }
    }
    list() {
        return Object.keys(this._diceSets);
    }
    get(id) {
        return this._diceSets[id];
    }
    addListener(listener) {
        const index = this._listeners.indexOf(listener);
        if (index === -1) {
            this._listeners.push(listener);
            if (listener.onAttached)
                listener.onAttached(this);
        }
    }
    removeListener(listener) {
        const index = this._listeners.indexOf(listener);
        if (index !== -1) {
            this._listeners.splice(index, 1);
            if (listener.onDetached)
                listener.onDetached(this);
        }
    }
    select(id) {
        if (!this._rolling && id !== this._current) {
            if (id === null || id in this._diceSets) {
                this._current = id;
                this.raiseDiceSetChangedEvent();
            }
            else {
                throw new Error(`Unknown DiceSet: ${id}.`);
            }
        }
    }
    roll() {
        const id = this._current;
        if (!this._rolling && id !== null) {
            const diceSet = this._diceSets[id];
            if (diceSet) {
                this._rolling = true;
                this.rollAsync(diceSet).then(() => {
                    this._rolling = false;
                }, (e) => {
                    this._rolling = false;
                    console.error(e);
                });
            }
        }
    }
    rollAsync(diceSet) {
        return __awaiter(this, void 0, void 0, function* () {
            this.raiseRollEvent(DiceRollEventType.Start);
            const endTime = Date.now() + this.duration;
            while (Date.now() < endTime) {
                this.updateDiceFaces(diceSet);
                this.raiseRollEvent(DiceRollEventType.Update);
                yield DiceManager.sleep(this.interval);
            }
            this.updateDiceFaces(diceSet);
            this.raiseRollEvent(DiceRollEventType.Update);
            this.raiseRollEvent(DiceRollEventType.Stop);
        });
    }
    updateDiceFaces(diceSet) {
        for (const group of diceSet) {
            group.value = DiceManager.random(group);
        }
    }
    raiseRollEvent(type) {
        for (const listener of this._listeners) {
            if (listener.onRoll)
                listener.onRoll(this, type);
        }
    }
    raiseDiceSetChangedEvent() {
        for (const listener of this._listeners) {
            if (listener.onDiceSetChanged)
                listener.onDiceSetChanged(this);
        }
    }
    static random(group) {
        return Math.floor(Math.random() * group.max) + 1;
    }
    static sleep(duration) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise(resolve => setTimeout(resolve, duration));
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = DiceManager;



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return StatusData; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__property__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__attribute__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__skill__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__operation__ = __webpack_require__(11);




const FORMAT = 'cthulhu-tools-status';
const VERSION = 0;
var StatusData;
(function (StatusData) {
    function validate(data) {
        return (typeof data === 'object' && data.format === FORMAT && typeof data.version === 'number');
    }
    StatusData.validate = validate;
    function create(content, manager) {
        if (manager !== undefined) {
            content = resolve(content, manager);
        }
        return Object.assign({
            format: FORMAT,
            version: VERSION,
        }, content);
    }
    StatusData.create = create;
    function resolve(content, manager) {
        const profiles = content.profiles ? Array.from(content.profiles) : [];
        const attributes = content.attributes ? Array.from(content.attributes) : [];
        const skills = content.skills ? Array.from(content.skills) : [];
        const characters = content.characters ? Array.from(content.characters) : [];
        const profileSet = new Set(profiles.map(x => x.uuid));
        const attributeSet = new Set(attributes.map(x => x.uuid));
        for (const character of characters) {
            const profile = manager.profiles.get(character.profile);
            if (profile && !profile.default && !profileSet.has(profile.uuid)) {
                profiles.push(profile);
                profileSet.add(profile.uuid);
            }
        }
        for (const profile of profiles) {
            const attributeList = manager.attributes.get(profile.attributes);
            for (const attribute of attributeList) {
                if (!attribute.default && !attributeSet.has(attribute.uuid)) {
                    attributes.push(attribute);
                    attributeSet.add(attribute.uuid);
                }
            }
        }
        return {
            profiles: (profiles.length !== 0 ? profiles : undefined),
            attributes: (attributes.length !== 0 ? attributes : undefined),
            skills: (skills.length !== 0 ? skills : undefined),
            characters: (characters.length !== 0 ? characters : undefined),
        };
    }
    StatusData.resolve = resolve;
})(StatusData || (StatusData = {}));
class StatusManager {
    constructor(profiles, attributes, skills, characters) {
        this.profiles = profiles;
        this.attributes = attributes;
        this.skills = skills;
        this.characters = characters;
    }
    validateProfile(profile) {
        return profile.attributes.every(x => this.attributes.contains(x));
    }
    validateCharacter(character) {
        return this.profiles.contains(character.profile) && this.validateProfile(this.profiles.get(character.profile));
    }
    import(data) {
        if (StatusData.validate(data)) {
            this.profiles.import(data.profiles);
            this.attributes.import(data.attributes);
            this.skills.import(data.skills);
            this.characters.import(data.characters);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = StatusManager;

class StatusProvider extends __WEBPACK_IMPORTED_MODULE_0__property__["a" /* CompositeProvider */] {
    constructor(manager, profile) {
        const target = manager.profiles.get(profile);
        super([
            new __WEBPACK_IMPORTED_MODULE_1__attribute__["a" /* AttributeProvider */](manager.attributes, target ? target.attributes : []),
            new __WEBPACK_IMPORTED_MODULE_2__skill__["a" /* SkillProvider */](manager.skills),
        ]);
    }
}
/* unused harmony export StatusProvider */

class StatusEvaluator extends __WEBPACK_IMPORTED_MODULE_0__property__["b" /* CompositeEvaluator */] {
    constructor(inputs, points) {
        super([
            new __WEBPACK_IMPORTED_MODULE_1__attribute__["b" /* AttributeEvaluator */](inputs),
            new __WEBPACK_IMPORTED_MODULE_2__skill__["b" /* SkillEvaluator */](points),
        ]);
    }
}
/* unused harmony export StatusEvaluator */

class StatusResolver {
    get provider() { return this.base.provider; }
    get evaluator() { return this.base.evaluator; }
    constructor(manager, character, useCache = true) {
        const provider = new StatusProvider(manager, character.profile);
        const evaluator = new StatusEvaluator(character.inputs, character.points);
        const history = character.history;
        this.base = new __WEBPACK_IMPORTED_MODULE_3__operation__["a" /* HistoryResolver */](provider, evaluator, history);
        this.useCache = useCache;
    }
    resolve(id, hash) {
        const result = this.base.resolve(id, hash);
        if (!this.useCache)
            this.base.clear();
        return result;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = StatusResolver;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DiceType; });
/* unused harmony export DiceGroup */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max) | 0;
}
var DiceType;
(function (DiceType) {
    DiceType[DiceType["D6"] = 0] = "D6";
    DiceType[DiceType["D10"] = 1] = "D10";
    DiceType[DiceType["D100"] = 2] = "D100";
})(DiceType || (DiceType = {}));
class Dice {
    constructor(type, face) {
        this.type = type;
        this.face = face;
    }
}
/* unused harmony export Dice */

var DiceGroup;
(function (DiceGroup) {
    function select(max) {
        if (max <= 0)
            throw new Error("'max' is too small.");
        if (max > 100)
            throw new Error("'max' is too large.");
        if (max <= 6)
            return new D6(max);
        if (max <= 10)
            return new D10(max);
        if (max <= 100)
            return new D100(max);
        throw new Error("Unreachable path.");
    }
    DiceGroup.select = select;
})(DiceGroup || (DiceGroup = {}));
class D6 {
    get value() { return this._dice.face; }
    set value(value) { this._dice.face = clamp(value, 1, this.max); }
    get max() { return this._max; }
    get dices() { return [this._dice]; }
    constructor(max) {
        this._max = clamp(max, 1, 6);
        this._dice = new Dice(DiceType.D6, 1);
        this.value = 1;
    }
    [Symbol.iterator]() {
        return this.dices[Symbol.iterator]();
    }
}
/* unused harmony export D6 */

class D10 {
    get value() { return (this._dice.face !== 0 ? this._dice.face : 10); }
    set value(value) { this._dice.face = clamp(value, 1, this.max) % 10; }
    get max() { return this._max; }
    get dices() { return [this._dice]; }
    constructor(max) {
        this._max = clamp(max, 1, 10);
        this._dice = new Dice(DiceType.D10, 0);
        this.value = this.max;
    }
    [Symbol.iterator]() {
        return this.dices[Symbol.iterator]();
    }
}
/* unused harmony export D10 */

class D100 {
    get value() { return (x => x !== 0 ? x : 100)(this._dices[0].face * 10 + this._dices[1].face); }
    set value(value) { (x => { this._dices[0].face = (x / 10) | 0; this._dices[1].face = x % 10; })(clamp(value, 1, this._max) % 100); }
    get max() { return this._max; }
    get dices() { return this._dices; }
    constructor(max) {
        this._max = clamp(max, 1, 100);
        this._dices = [
            new Dice(DiceType.D100, 0),
            new Dice(DiceType.D10, 0),
        ];
        this.value = this.max;
    }
    [Symbol.iterator]() {
        return this.dices[Symbol.iterator]();
    }
}
/* unused harmony export D100 */

class DiceSet {
    constructor(groups) {
        this.groups = groups;
    }
    get size() { return this.groups.length; }
    get values() { return this.groups.map(group => group.value); }
    set values(value) { this.groups.forEach((group, index) => { group.value = value[index]; }); }
    get total() { return this.groups.reduce((sum, group) => sum + group.value, 0); }
    get max() { return this.groups.reduce((sum, group) => sum + group.max, 0); }
    [Symbol.iterator]() {
        return this.groups[Symbol.iterator]();
    }
    static create(count, max) {
        const groups = [];
        for (let i = 0; i < count; i++) {
            groups.push(DiceGroup.select(max));
        }
        return new DiceSet(groups);
    }
    static parse(expression) {
        if (!this.DICE_REGEX.test(expression))
            throw new Error("Invalid expression.");
        const [first, second] = expression.split("D");
        const count = parseInt(first, 10);
        const max = parseInt(second, 10);
        return this.create(count, max);
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = DiceSet;

DiceSet.DICE_REGEX = /[1-9]\d*D[1-9]\d*/;


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__evaluation__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utility__ = __webpack_require__(1);
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


const CATEGORIES = {
    locomotion: 'locomotion',
    exploration: 'exploration',
    knowledge: 'knowledge',
    communication: 'communication',
    language: 'language',
    combat: 'combat',
    special: 'special',
    other: 'other',
};
class Skill {
    constructor(data) {
        this.id = String(data.id);
        this.name = String(data.name);
        this.category = CATEGORIES[data.category] || 'other';
        this.dependencies = Array.from(data.dependencies).map(x => String(x));
        this.base = (isFiniteOrString(data.base) ? data.base : 0);
    }
    get view() { return false; }
    get default() { return this._default; }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            category: this.category,
            dependencies: this.dependencies,
            base: this.base,
        };
    }
    markAsDefault() {
        return (this._default = true, this);
    }
    evaluate(points, resolver) {
        const base = (typeof this.base === 'number' ? this.base : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__evaluation__["a" /* default */])(this.base, resolver));
        const extra = ((points !== null && points.get(this.id)) || 0);
        return (base + extra);
    }
    validate(points, resolver, value) {
        return (Math.max(Math.min(value, Skill.MAX_VALUE), Skill.MIN_VALUE) | 0);
    }
}
/* unused harmony export Skill */

Skill.MIN_VALUE = 0;
Skill.MAX_VALUE = 99;
class SkillPointSet {
    constructor(data) {
        this.clear();
        this.merge(data);
    }
    toJSON() {
        return this._data;
    }
    clear() {
        this._data = Object.create(null);
    }
    contains(id) {
        return (id in this._data);
    }
    get(id) {
        return (id in this._data ? this._data[id] : 0);
    }
    set(id, value) {
        if (value !== 0) {
            this._data[id] = value;
        }
        else {
            delete this._data[id];
        }
    }
    merge(data) {
        if (data instanceof SkillPointSet) {
            Object.assign(this._data, data._data);
        }
        else {
            Object.assign(this._data, data);
        }
    }
    skills() {
        return Object.keys(this._data);
    }
    [Symbol.iterator]() {
        return Object.keys(this._data).map(key => [key, this._data[key]])[Symbol.iterator]();
    }
}
/* harmony export (immutable) */ __webpack_exports__["d"] = SkillPointSet;

class SkillManager {
    constructor() {
        this._table = Object.create(null);
    }
    contains(id) {
        return (id in this._table);
    }
    get(id) {
        return this._table[id];
    }
    list() { return Object.keys(this._table).map(key => this._table[key]); }
    add(skill) {
        const id = skill.id;
        const item = this._table[id];
        if (item === undefined || !item.default) {
            this._table[id] = skill;
        }
    }
    remove(skill) {
        const id = skill.id;
        const item = this._table[id];
        if (item !== undefined && !item.default) {
            delete this._table[id];
        }
    }
    load(url, asDefault = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utility__["b" /* requestJSON */])(url);
            for (const entry of data) {
                const skill = new Skill(entry);
                if (asDefault)
                    skill.markAsDefault();
                this.add(skill);
            }
        });
    }
    import(data) {
        if (Array.isArray(data)) {
            for (const skill of data) {
                this.add(new Skill(skill));
            }
        }
    }
    [Symbol.iterator]() {
        return this.list()[Symbol.iterator]();
    }
}
/* harmony export (immutable) */ __webpack_exports__["c"] = SkillManager;

class SkillProvider {
    constructor(manager) {
        this.manager = manager;
    }
    property(id) {
        return this.manager.get(id);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SkillProvider;

class SkillEvaluator {
    constructor(points) {
        this.points = points;
    }
    supports(property) {
        return (property instanceof Skill);
    }
    evaluate(property, resolver) {
        return (property instanceof Skill ? property.evaluate(this.points, resolver) : undefined);
    }
    validate(property, resolver, value) {
        return (property instanceof Skill ? property.validate(this.points, resolver, value) : value);
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = SkillEvaluator;

function isFiniteOrString(x) {
    return Number.isFinite(x) || typeof x === 'string';
}


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Attribute */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__input__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__evaluation__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utility__ = __webpack_require__(1);
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



class AttributeBase {
    constructor(data, uuid = data.uuid || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utility__["c" /* generateUUID */])()) {
        this.uuid = String(uuid);
        this.id = String(data.id);
        this.name = String(data.name);
        this.dependencies = Array.from(data.dependencies).map(x => String(x));
        this.inputs = Array.from(data.inputs).map(x => __WEBPACK_IMPORTED_MODULE_0__input__["a" /* InputMethod */].from(x));
        this.expression = String(data.expression);
        this.view = (data.view === true);
        this.hidden = (data.hidden === true);
        this._default = false;
    }
    get default() { return this._default; }
    toJSON() {
        return {
            type: this.type,
            uuid: this.uuid,
            id: this.id,
            name: this.name,
            dependencies: this.dependencies,
            inputs: this.inputs,
            expression: this.expression,
            view: this.view || undefined,
            hidden: this.hidden || undefined,
        };
    }
    markAsDefault() {
        return (this._default = true, this);
    }
    evaluate(data, resolver) {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__evaluation__["a" /* default */])(this.expression, resolver, this.evaluateInputs(data));
    }
    validate(data, resolver, value) {
        return value;
    }
    evaluateInputs(data) {
        return this.inputs.reduce((values, input) => Object.assign(values, input.evaluate(data)), {});
    }
}
class IntegerAttribute extends AttributeBase {
    get type() { return 'integer'; }
    get min() { return (this._min !== undefined ? this._min : -Infinity); }
    get max() { return (this._max !== undefined ? this._max : Infinity); }
    constructor(data, uuid) {
        super(data, uuid);
        if (isFiniteOrString(data.min))
            this._min = data.min;
        if (isFiniteOrString(data.max))
            this._max = data.max;
    }
    toJSON() {
        return Object.assign(super.toJSON(), {
            min: this._min,
            max: this._max,
        });
    }
    evaluate(data, resolver) {
        return (super.evaluate(data, resolver) | 0);
    }
    validate(data, resolver, value) {
        let cache;
        const inputs = () => cache || (cache = this.evaluateInputs(data));
        const min = (typeof this.min === 'number' ? this.min : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__evaluation__["a" /* default */])(this.min, resolver, inputs()));
        const max = (typeof this.max === 'number' ? this.max : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__evaluation__["a" /* default */])(this.max, resolver, inputs()));
        return (Math.max(Math.min(value, max), min) | 0);
    }
}
/* unused harmony export IntegerAttribute */

class NumberAttribute extends AttributeBase {
    get type() { return 'number'; }
    get min() { return (this._min !== undefined ? this._min : -Infinity); }
    get max() { return (this._max !== undefined ? this._max : Infinity); }
    constructor(data, uuid) {
        super(data, uuid);
        if (isFiniteOrString(data.min))
            this._min = data.min;
        if (isFiniteOrString(data.max))
            this._max = data.max;
    }
    toJSON() {
        return Object.assign(super.toJSON(), {
            min: this._min,
            max: this._max,
        });
    }
    evaluate(data, resolver) {
        return Number(super.evaluate(data, resolver));
    }
    validate(data, resolver, value) {
        let cache;
        const inputs = () => cache || (cache = this.evaluateInputs(data));
        const min = (typeof this.min === 'number' ? this.min : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__evaluation__["a" /* default */])(this.min, resolver, inputs()));
        const max = (typeof this.max === 'number' ? this.max : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__evaluation__["a" /* default */])(this.max, resolver, inputs()));
        return Math.max(Math.min(value, max), min);
    }
}
/* unused harmony export NumberAttribute */

class TextAttribute extends AttributeBase {
    get type() { return 'text'; }
    constructor(data, uuid) {
        super(data, uuid);
    }
    toJSON() {
        return super.toJSON();
    }
    evaluate(data, resolver) {
        return String(super.evaluate(data, resolver));
    }
    validate(data, resolver, value) {
        return String(value);
    }
}
/* unused harmony export TextAttribute */

var Attribute;
(function (Attribute) {
    function from(data) {
        switch (data.type) {
            case 'integer': return new IntegerAttribute(data);
            case 'number': return new NumberAttribute(data);
            case 'text': return new TextAttribute(data);
            default: throw new Error("Invalid attribute type.");
        }
    }
    Attribute.from = from;
})(Attribute || (Attribute = {}));
class AttributeManager {
    constructor() {
        this._table = Object.create(null);
    }
    contains(uuid) {
        return (uuid in this._table);
    }
    get(uuid) {
        if (Array.isArray(uuid)) {
            return uuid.map(x => this._table[x]).filter(x => x !== undefined);
        }
        else {
            return this._table[uuid];
        }
    }
    list() { return Object.keys(this._table).map(key => this._table[key]); }
    add(attribute) {
        const uuid = attribute.uuid;
        const item = this._table[uuid];
        if (item === undefined || !item.default) {
            this._table[uuid] = attribute;
        }
    }
    remove(attribute) {
        const uuid = attribute.uuid;
        const item = this._table[uuid];
        if (item !== undefined && !item.default) {
            delete this._table[uuid];
        }
    }
    load(url, asDefault = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utility__["b" /* requestJSON */])(url);
            for (const entry of data) {
                const attribute = Attribute.from(entry);
                if (asDefault)
                    attribute.markAsDefault();
                this.add(attribute);
            }
        });
    }
    import(data) {
        if (Array.isArray(data)) {
            for (const attribute of data) {
                this.add(Attribute.from(attribute));
            }
        }
    }
    [Symbol.iterator]() {
        return this.list()[Symbol.iterator]();
    }
}
/* harmony export (immutable) */ __webpack_exports__["c"] = AttributeManager;

class AttributeProvider {
    constructor(manager, uuidList) {
        this.manager = manager;
        this._table = Object.create(null);
        for (const uuid of uuidList) {
            const attribute = manager.get(uuid);
            if (attribute) {
                this._table[attribute.id] = uuid;
            }
        }
    }
    property(id) {
        const uuid = this._table[id];
        return (uuid !== undefined ? this.manager.get(uuid) : undefined);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AttributeProvider;

class AttributeEvaluator {
    constructor(inputs) {
        this.inputs = inputs;
    }
    supports(property) {
        return (property instanceof AttributeBase);
    }
    evaluate(property, resolver) {
        return (property instanceof AttributeBase ? property.evaluate(this.getInputData(property), resolver) : undefined);
    }
    validate(property, resolver, value) {
        return (property instanceof AttributeBase ? property.validate(this.getInputData(property), resolver, value) : value);
    }
    getInputData(property) {
        return this.inputs.get(property.id) || new __WEBPACK_IMPORTED_MODULE_0__input__["b" /* InputData */]();
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = AttributeEvaluator;

function isFiniteOrString(x) {
    return Number.isFinite(x) || typeof x === 'string';
}


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = evaluate;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_expr_eval__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_expr_eval___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_expr_eval__);

function evaluate(expression, resolver, map) {
    const parser = new CustomParser();
    const result = parser.parse(expression);
    const values = Object.create(null);
    for (const variable of result.variables()) {
        if (map !== undefined && Object.prototype.hasOwnProperty.call(map, variable)) {
            values[variable] = map[variable];
        }
        else {
            values[variable] = resolver.resolve(variable);
        }
    }
    return result.evaluate(values);
}
class CustomParser extends __WEBPACK_IMPORTED_MODULE_0_expr_eval__["Parser"] {
    constructor() {
        super();
        this.customize();
    }
    customize() {
        this.unaryOps = {
            '-': (x) => -x,
            '+': (x) => +x,
            '!': (x) => !x,
        };
        this.functions = {
            abs: Math.abs,
            ceil: Math.ceil,
            floor: Math.floor,
            round: Math.round,
            trunc: Math.trunc,
            random: Math.random,
            min: Math.min,
            max: Math.max,
        };
        this.consts = {
            true: true,
            false: false
        };
    }
}


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return InputMethod; });
class InputMethodBase {
    constructor(...args) {
        if (args.length === 1 && typeof (args[0]) === 'object') {
            const data = args[0];
            this.name = String(data.name);
        }
        else {
            const name = args[0];
            this.name = name;
        }
    }
    toJSON() {
        return {
            type: this.type,
            name: this.name,
        };
    }
}
class DiceInputMethod extends InputMethodBase {
    get type() { return 'dice'; }
    constructor(...args) {
        if (args.length === 1 && typeof args[0] === 'object') {
            const data = args[0];
            super(data);
            this.count = Number(data.count);
            this.max = Number(data.max);
        }
        else {
            const name = args[0];
            const count = args[1];
            const max = args[2];
            super(name);
            this.count = count;
            this.max = max;
        }
    }
    toJSON() {
        return Object.assign(super.toJSON(), {
            count: this.count,
            max: this.max,
        });
    }
    evaluate(data) {
        const dices = (data !== null && data.get(this)) || Array(this.count).fill(0);
        const values = dices.reduce((values, value, index) => Object.assign(values, { [this.name + index.toString(10)]: Number(value) }), {});
        const sum = dices.reduce((sum, value) => sum + Number(value), 0);
        return Object.assign(values, { [this.name]: sum });
    }
}
/* unused harmony export DiceInputMethod */

class NumberInputMethod extends InputMethodBase {
    get type() { return 'number'; }
    get min() { return (this._min !== undefined ? this._min : -Infinity); }
    get max() { return (this._max !== undefined ? this._max : Infinity); }
    get step() { return (this._step !== undefined ? this._step : 1); }
    constructor(...args) {
        if (args.length === 1 && typeof args[0] === 'object') {
            const data = args[0];
            super(data);
            if (Number.isFinite(data.min))
                this._min = data.min;
            if (Number.isFinite(data.max))
                this._max = data.max;
            if (Number.isFinite(data.step))
                this._step = data.step;
        }
        else {
            const name = args[0];
            const min = args[1];
            const max = args[2];
            const step = args[3];
            super(name);
            if (Number.isFinite(min))
                this._min = min;
            if (Number.isFinite(max))
                this._max = max;
            if (Number.isFinite(step))
                this._step = step;
        }
    }
    toJSON() {
        return Object.assign(super.toJSON(), {
            min: this._min,
            max: this._max,
            step: this._step,
        });
    }
    evaluate(data) {
        return { [this.name]: Number((data !== null && data.get(this)) || 0) };
    }
}
/* unused harmony export NumberInputMethod */

class TextInputMethod extends InputMethodBase {
    get type() { return 'text'; }
    constructor(...args) {
        if (args.length === 1 && typeof args[0] === 'object') {
            const data = args[0];
            super(data);
        }
        else {
            const name = args[0];
            super(name);
        }
    }
    toJSON() {
        return super.toJSON();
    }
    evaluate(data) {
        return { [this.name]: String((data !== null && data.get(this)) || "") };
    }
}
/* unused harmony export TextInputMethod */

var InputMethod;
(function (InputMethod) {
    function from(data) {
        switch (data.type) {
            case 'dice': return new DiceInputMethod(data);
            case 'number': return new NumberInputMethod(data);
            case 'text': return new TextInputMethod(data);
            default: throw new Error("Invalid input type.");
        }
    }
    InputMethod.from = from;
})(InputMethod || (InputMethod = {}));
class InputData {
    constructor(data) {
        this.clear();
        this.merge(data);
    }
    toJSON() {
        return this._data;
    }
    clear() {
        this._data = Object.create(null);
    }
    contains(name) {
        return (name in this._data);
    }
    get(input) {
        return this.getByName(input.name);
    }
    set(input, value) {
        this.setByName(input.name, value);
    }
    getByName(name) {
        return this._data[name];
    }
    setByName(name, value) {
        if (value !== undefined) {
            this._data[name] = value;
        }
        else {
            delete this._data[name];
        }
    }
    merge(data) {
        if (data instanceof InputData) {
            Object.assign(this._data, data._data);
        }
        else {
            Object.assign(this._data, data);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = InputData;

class InputDataSet {
    constructor(data) {
        this.clear();
        this.merge(data);
    }
    toJSON() {
        return this._data;
    }
    clear() {
        this._data = Object.create(null);
    }
    contains(id) {
        return (id in this._data);
    }
    get(id) {
        return this._data[id];
    }
    getInput(id, input) {
        return (this.contains(id) ? this._data[id].get(input) : undefined);
    }
    set(id, value, replace = false) {
        if (replace || !this.contains(id)) {
            this._data[id] = new InputData(value);
        }
        else {
            this._data[id].merge(value);
        }
    }
    setInput(id, input, value) {
        (this.contains(id) ? this._data[id] : (this._data[id] = new InputData())).set(input, value);
    }
    merge(data) {
        if (data instanceof InputDataSet) {
            for (const key of Object.keys(data._data)) {
                this._data[key] = new InputData(data._data[key]);
            }
        }
        else if (data !== undefined) {
            for (const key of Object.keys(data)) {
                this._data[key] = new InputData(data[key]);
            }
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["c"] = InputDataSet;



/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Item {
    constructor(...args) {
        if (args.length === 1 && typeof args[0] === 'object') {
            const data = args[0];
            this.name = String(data.name);
            this.description = (data.description !== undefined ? String(data.description) : "");
        }
        else {
            const name = args[0];
            const description = args[1];
            this.name = name;
            this.description = (description !== undefined ? description : "");
        }
    }
    toJSON() {
        return {
            name: this.name,
            description: this.description || undefined,
        };
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Item;



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Operation */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utility__ = __webpack_require__(1);

class OperationBase {
    constructor(...args) {
        if (args.length === 1 && typeof args[0] === 'object') {
            const data = args[0];
            this.parent = (typeof data.parent === 'string' ? data.parent : null);
            this.target = String(data.target);
            this.message = (data.message !== undefined ? String(data.message) : "");
        }
        else {
            const parent = args[0];
            const target = args[1];
            const message = args[2];
            this.parent = parent;
            this.target = target;
            this.message = (message !== undefined ? message : "");
        }
    }
    get repr() { return `${this.parent}@${this.target} "${this.message}"`; }
    get hash() { return this._hash || (this._hash = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utility__["a" /* getSHA256 */])(this.repr)); }
    toJSON() {
        return {
            type: this.type,
            parent: this.parent,
            target: this.target,
            message: this.message || undefined,
        };
    }
    toString() {
        return `${this.hash}: ${this.repr}`;
    }
}
/* unused harmony export OperationBase */

class SetNumberOperation extends OperationBase {
    get type() { return 'set<number>'; }
    get repr() { return `${this.type} ${this.value} # ${super.repr}`; }
    constructor(...args) {
        if (args.length === 1 && typeof args[0] === 'object') {
            const data = args[0];
            super(data);
            this.value = Number(data.value);
        }
        else {
            const parent = args[0];
            const target = args[1];
            const value = args[2];
            const message = args[3];
            super(parent, target, message);
            this.value = value;
        }
    }
    toJSON() {
        return Object.assign(super.toJSON(), {
            value: this.value,
        });
    }
    apply(value) {
        return this.value;
    }
}
/* unused harmony export SetNumberOperation */

class SetTextOperation extends OperationBase {
    get type() { return 'set<text>'; }
    get repr() { return `${this.type} ${this.value} # ${super.repr}`; }
    constructor(...args) {
        if (args.length === 1 && typeof args[0] === 'object') {
            const data = args[0];
            super(data);
            this.value = String(data.value);
        }
        else {
            const parent = args[0];
            const target = args[1];
            const value = args[2];
            const message = args[3];
            super(parent, target, message);
            this.value = value;
        }
    }
    toJSON() {
        return Object.assign(super.toJSON(), {
            value: this.value,
        });
    }
    apply(value) {
        return this.value;
    }
}
/* unused harmony export SetTextOperation */

class AddNumberOperation extends OperationBase {
    get type() { return 'add<number>'; }
    get repr() { return `${this.type} ${this.value} # ${super.repr}`; }
    constructor(...args) {
        if (args.length === 1 && typeof args[0] === 'object') {
            const data = args[0];
            super(data);
            this.value = Number(data.value);
        }
        else {
            const parent = args[0];
            const target = args[1];
            const value = args[2];
            const message = args[3];
            super(parent, target, message);
            this.value = value;
        }
    }
    toJSON() {
        return Object.assign(super.toJSON(), {
            value: this.value,
        });
    }
    apply(value) {
        return Number(value) + this.value;
    }
}
/* unused harmony export AddNumberOperation */

var Operation;
(function (Operation) {
    function from(data) {
        switch (data.type) {
            case 'set<number>': return new SetNumberOperation(data);
            case 'set<text>': return new SetTextOperation(data);
            case 'add<number>': return new AddNumberOperation(data);
            default: throw new Error("Invalid opearation type.");
        }
    }
    Operation.from = from;
})(Operation || (Operation = {}));
class History {
    get head() { return this._head; }
    set head(value) { this._head = ((value !== null && value in this._table) ? value : null); }
    get current() { return (this._head !== null ? this._table[this._head] : null); }
    get operations() { return this._operations; }
    constructor(data) {
        if (data !== undefined) {
            this._head = data.head;
            this._operations = Array.from(data.operations).map(x => Operation.from(x));
        }
        else {
            this._head = null;
            this._operations = [];
        }
        this._table = this.makeTable();
        this._tree = this.makeTree();
        this.validate();
    }
    toJSON() {
        return {
            head: this._head,
            operations: this._operations,
        };
    }
    contains(hash) {
        return (hash in this._table);
    }
    get(hash) {
        return this._table[hash];
    }
    add(operation, transitive) {
        const hash = operation.hash;
        const parent = operation.parent;
        if (!this.contains(hash) && (parent === null || this.contains(parent))) {
            this._operations.push(operation);
            this._table[hash] = operation;
            if (parent !== null)
                (this._tree[parent] || (this._tree[parent] = [])).push(hash);
            if (transitive === true)
                this._head = hash;
        }
    }
    remove(operation, prune) {
        if (this.contains(operation.hash)) {
            if (prune === true) {
                this.prune(operation.hash);
            }
            else {
                this.erase(operation.hash);
            }
        }
    }
    [Symbol.iterator]() {
        return this._operations[Symbol.iterator]();
    }
    makeTable() {
        const table = Object.create(null);
        for (const operation of this._operations) {
            table[operation.hash] = operation;
        }
        return table;
    }
    makeTree() {
        const tree = Object.create(null);
        for (const operation of this._operations) {
            const parent = operation.parent;
            if (parent !== null) {
                const children = tree[parent] || (tree[parent] = []);
                children.push(operation.hash);
            }
        }
        return tree;
    }
    validate() {
        const roots = this._operations.filter(x => x.parent === null);
        const reachable = Object.assign(Object.create(null), ...roots.map(x => this.reachable(x.hash)));
        if (this._operations.some(x => !reachable[x.hash])) {
            this._operations = this._operations.filter(x => reachable[x.hash]);
            this._table = this.makeTable();
            this._tree = this.makeTree();
        }
        if (this._head !== null && !(this._head in this._table)) {
            this.head = null;
        }
    }
    traverse(start, action) {
        const stack = [start];
        while (stack.length !== 0) {
            const current = stack.pop();
            if (!action(current)) {
                const children = this._tree[current];
                if (children)
                    stack.push(...children);
            }
        }
    }
    reachable(start) {
        const reachable = Object.create(null);
        this.traverse(start, node => {
            const stop = (reachable[node] === false);
            if (!stop)
                reachable[node] = !reachable[node];
            return stop;
        });
        return reachable;
    }
    prune(hash) {
        const reachable = this.reachable(hash);
        while (this._head !== null && this._head in reachable) {
            this._head = this._table[this._head].parent;
        }
        this._operations = this._operations.filter(x => !(x.hash in reachable));
        for (const node of Object.keys(reachable)) {
            delete this._table[node];
            delete this._tree[node];
        }
    }
    erase(hash) {
        const erased = this._table[hash];
        const map = Object.create(null);
        if (erased.parent !== null)
            map[erased.parent] = this._table[erased.parent];
        this.traverse(hash, node => {
            if (node !== hash) {
                const operation = this._table[node];
                ;
                const oldParent = (operation.parent !== hash ? operation.parent : erased.parent);
                const newParent = (oldParent !== null ? map[oldParent].hash : null);
                const revised = Operation.from(Object.assign(operation.toJSON(), { parent: newParent }));
                map[node] = revised;
            }
        });
        if (this._head === hash)
            this._head = erased.parent || null;
        if (this._head !== null && this._head in map)
            this._head = map[this._head].hash;
        this._operations = this._operations.map(x => x.hash in map ? map[x.hash] : x);
        this._operations.splice(this._operations.findIndex(x => x.hash === hash), 1);
        this._table = this.makeTable();
        this._tree = this.makeTree();
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = History;

class HistoryResolver {
    constructor(provider, evaluator, history) {
        this.provider = provider;
        this.evaluator = evaluator;
        this.history = history;
        this.clear();
    }
    resolve(id, hash = this.history.head) {
        const key = (hash !== null ? hash : "@initial");
        const values = (this._cache[key] || (this._cache[key] = Object.create(null)));
        if (!(id in values)) {
            values[id] = undefined;
            const property = this.provider.property(id);
            if (property) {
                if (hash !== null && !property.view) {
                    const operation = this.history.get(hash);
                    if (operation) {
                        const oldValue = this.resolve(id, operation.parent);
                        const newValue = (operation.target === id ? operation.apply(oldValue) : oldValue);
                        values[id] = newValue;
                    }
                }
                else {
                    values[id] = this.evaluateOn(property, hash);
                }
            }
        }
        return values[id];
    }
    clear() {
        this._cache = Object.create(null);
    }
    evaluateOn(property, hash) {
        if (this.evaluator.supports(property)) {
            const resolver = new HistoryResolver.SubResolver(this, hash);
            const evaluated = this.evaluator.evaluate(property, resolver);
            const validated = this.evaluator.validate(property, resolver, evaluated);
            return validated;
        }
        return undefined;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = HistoryResolver;

HistoryResolver.SubResolver = class SubResolver {
    constructor(parent, hash) {
        this.parent = parent;
        this.hash = hash;
    }
    get provider() { return this.parent.provider; }
    get evaluator() { return this.parent.evaluator; }
    resolve(id) { return this.parent.resolve(id, this.hash); }
};


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_model_dice_roll__ = __webpack_require__(3);

class DiceRenderer {
    constructor(view, image, group, dice) {
        this.view = view;
        this.image = image;
        this.group = group;
        this.dice = dice;
        this._map = new Map();
    }
    clear() {
        this._map.clear();
        DiceRenderer.clearChildren(this.view);
    }
    onAttached(manager) {
        this.initDices(manager);
    }
    onDetached(manager) {
        this.clear();
    }
    onRoll(manager, type) {
        if (type === __WEBPACK_IMPORTED_MODULE_0_model_dice_roll__["b" /* DiceRollEventType */].Update) {
            const diceSet = manager.diceSet;
            if (diceSet) {
                this.refresh(diceSet);
            }
        }
    }
    onDiceSetChanged(manager) {
        this.initDices(manager);
    }
    initDices(manager) {
        this.clear();
        const diceSet = manager.diceSet;
        if (diceSet) {
            this.makeDices(diceSet);
            this.refresh(diceSet);
        }
    }
    makeDices(diceSet) {
        for (const group of diceSet) {
            const groupElement = DiceRenderer.createElement(this.view, 'div', this.group);
            for (const dice of group) {
                const diceElement = DiceRenderer.createElement(groupElement, 'canvas', this.dice);
                this._map.set(dice, diceElement);
            }
        }
    }
    refresh(diceSet) {
        for (const group of diceSet) {
            for (const dice of group) {
                const element = this._map.get(dice);
                if (element != null) {
                    this.image.blit(element, dice.type, dice.face);
                }
            }
        }
    }
    static createElement(parent, tag, clazz) {
        const element = document.createElement(tag);
        if (clazz)
            element.classList.add(clazz);
        return parent.appendChild(element);
    }
    static clearChildren(element) {
        while (element.lastChild)
            element.removeChild(element.lastChild);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = DiceRenderer;



/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_model_dice__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_model_dice_roll__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_view_dice_renderer__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_view_dice_number_renderer__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__application__ = __webpack_require__(0);





let page;
let dialog;
const manager = new __WEBPACK_IMPORTED_MODULE_1_model_dice_roll__["a" /* DiceManager */]();
/* harmony default export */ __webpack_exports__["a"] = (function () {
    page = document.getElementById("dice");
    dialog = document.getElementById("custom-dice-dialog");
    initDiceSet();
    initRollButton();
    initRollSound();
    initDiceView();
    initNumberView();
    initCustomDiceDialog();
});
function initDiceSet() {
    const elements = Array.from(page.querySelectorAll(".mode-list .mode"));
    const modes = elements.map(element => [element, element.dataset['dice'] || 'custom']);
    for (const [mode, id] of modes) {
        if (id === 'custom') {
            mode.addEventListener("click", () => { openCustomDiceDialog(); });
        }
        else {
            mode.addEventListener("click", () => { manager.select(id); });
            manager.register(id, __WEBPACK_IMPORTED_MODULE_0_model_dice__["b" /* DiceSet */].parse(id));
        }
    }
    manager.addListener(new class {
        onDiceSetChanged() {
            for (const [mode, id] of modes) {
                if (manager.current === id) {
                    mode.classList.add('selected');
                }
                else {
                    mode.classList.remove('selected');
                }
            }
        }
    });
}
function initRollButton() {
    const rollButton = page.querySelector(".roll-button");
    rollButton.addEventListener("click", () => { manager.roll(); });
}
function initRollSound() {
    manager.addListener(new class {
        onRoll(manager, type) {
            if (type === __WEBPACK_IMPORTED_MODULE_1_model_dice_roll__["b" /* DiceRollEventType */].Start) {
                const sound = __WEBPACK_IMPORTED_MODULE_4__application__["c" /* resources */].diceSound;
                sound.pause();
                sound.currentTime = 0;
                sound.play();
            }
        }
    }());
}
function initDiceView() {
    const diceView = page.querySelector(".result .dice-view");
    manager.addListener(new __WEBPACK_IMPORTED_MODULE_2_view_dice_renderer__["a" /* default */](diceView, __WEBPACK_IMPORTED_MODULE_4__application__["c" /* resources */].diceImage, 'dice-group', 'dice'));
}
function initNumberView() {
    const numberView = page.querySelector(".result .number-view");
    manager.addListener(new __WEBPACK_IMPORTED_MODULE_3_view_dice_number_renderer__["a" /* default */](numberView, 'critical', 'fumble'));
}
function initCustomDiceDialog() {
    const okButton = dialog.querySelector(".ok");
    const cancelButton = dialog.querySelector(".cancel");
    okButton.addEventListener("click", () => { closeCustomDiceDialog(false); });
    cancelButton.addEventListener("click", () => { closeCustomDiceDialog(true); });
}
function openCustomDiceDialog() {
    dialog.classList.add('open');
}
function closeCustomDiceDialog(cancel) {
    dialog.classList.remove('open');
    if (!cancel)
        registerCustomDice();
}
function registerCustomDice() {
    const countInput = dialog.querySelector(".count");
    const maxInput = dialog.querySelector(".max");
    if (countInput.validity.valid && maxInput.validity.valid) {
        const id = 'custom';
        const count = parseInt(countInput.value, 10);
        const max = parseInt(maxInput.value, 10);
        const diceSet = __WEBPACK_IMPORTED_MODULE_0_model_dice__["b" /* DiceSet */].create(count, max);
        manager.register(id, diceSet);
        manager.select(id);
    }
}


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__application__ = __webpack_require__(0);

/* harmony default export */ __webpack_exports__["a"] = (function () {
    initPageSwitch();
    initNavigation();
    initOverlay();
});
function initPageSwitch() {
    const elements = Array.from(document.querySelectorAll("[data-page]"));
    __WEBPACK_IMPORTED_MODULE_0__application__["b" /* navigation */].addListener(new class {
        onEnter(page) {
            for (const element of elements) {
                if (element.dataset['page'] === page) {
                    element.classList.add('selected');
                }
            }
        }
        onExit(page) {
            for (const element of elements) {
                if (element.dataset['page'] === page) {
                    element.classList.remove('selected');
                }
            }
        }
    });
}
function initNavigation() {
    const elements = Array.from(document.querySelectorAll("[data-nav]"));
    for (const element of elements) {
        element.addEventListener('click', () => __WEBPACK_IMPORTED_MODULE_0__application__["b" /* navigation */].toPage(element.dataset['nav']));
    }
}
function initOverlay() {
    const overlays = Array.from(document.querySelectorAll(".page > .overlay"));
    for (const overlay of overlays) {
        const refresh = () => {
            const parent = overlay.parentElement;
            const children = Array.from(overlay.children);
            if (children.some(child => window.getComputedStyle(child).display !== 'none')) {
                parent.classList.add('overlaid');
            }
            else {
                parent.classList.remove('overlaid');
            }
        };
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                const dialog = mutation.target;
                if (dialog instanceof HTMLElement && dialog.classList.contains('dialog')) {
                    refresh();
                }
            }
        });
        observer.observe(overlay, { attributes: true, attributeFilter: ['class'], subtree: true });
    }
}


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function () {
    if (NodeList.prototype.forEach === undefined) {
        NodeList.prototype.forEach = function (callbackfn, thisArg) {
            Array.prototype.forEach.call(this, callbackfn, thisArg);
        };
    }
});


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_model_status__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__application__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__character_management__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__character_edit__ = __webpack_require__(20);




let page;
/* harmony default export */ __webpack_exports__["a"] = (function () {
    page = document.getElementById('status');
    loadDefaultData().then(() => {
        initCharacters();
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__character_management__["a" /* default */])();
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__character_edit__["a" /* default */])();
    });
    ;
});
function initCharacters() {
    const characters = page.querySelector(".characters");
    const templates = {
        character: characters.querySelector(".character-template"),
        integer: characters.querySelector(".integer-template"),
        number: characters.querySelector(".number-template"),
        text: characters.querySelector(".text-template"),
        skill: characters.querySelector(".skill-template"),
        item: characters.querySelector(".item-template"),
    };
    __WEBPACK_IMPORTED_MODULE_1__application__["a" /* status */].characters.addListener(new class {
        onCharacterListChanged(operation, target) {
            refreshCharacters(characters, templates);
        }
    });
    refreshCharacters(characters, templates);
}
function refreshCharacters(characters, templates) {
    characters.querySelectorAll(".character").forEach(x => x.remove());
    for (const character of __WEBPACK_IMPORTED_MODULE_1__application__["a" /* status */].characters) {
        if (__WEBPACK_IMPORTED_MODULE_1__application__["a" /* status */].validateCharacter(character) && character.visible) {
            const resolver = new __WEBPACK_IMPORTED_MODULE_0_model_status__["a" /* StatusResolver */](__WEBPACK_IMPORTED_MODULE_1__application__["a" /* status */], character);
            const profile = __WEBPACK_IMPORTED_MODULE_1__application__["a" /* status */].profiles.get(character.profile);
            const attributes = __WEBPACK_IMPORTED_MODULE_1__application__["a" /* status */].attributes.get(profile.attributes);
            const points = character.points;
            const items = character.items;
            const characterElement = document.importNode(templates.character.content, true);
            const attrContainer = characterElement.querySelector(".attributes");
            for (const attr of attributes) {
                switch (attr.type) {
                    case 'integer':
                        attrContainer.appendChild(newAttribute(attr, resolver, templates.integer));
                        break;
                    case 'number':
                        attrContainer.appendChild(newAttribute(attr, resolver, templates.number));
                        break;
                    case 'text':
                        attrContainer.appendChild(newAttribute(attr, resolver, templates.text));
                        break;
                }
            }
            const skillContainer = characterElement.querySelector(".skills");
            for (const [id, point] of points) {
                const skill = __WEBPACK_IMPORTED_MODULE_1__application__["a" /* status */].skills.get(id);
                if (skill) {
                    skillContainer.appendChild(newSkill(skill, resolver, templates.skill));
                }
            }
            const itemContainer = characterElement.querySelector(".items");
            for (const item of items) {
                itemContainer.appendChild(newItem(item, resolver, templates.item));
            }
            characters.appendChild(characterElement);
        }
    }
}
function newAttribute(attribute, resolver, template) {
    const node = document.importNode(template.content, true);
    const element = node.querySelector(".attribute");
    const nameElement = node.querySelector(".attr-name");
    const valueElement = node.querySelector(".attr-value");
    element.dataset['attr'] = attribute.id;
    nameElement.textContent = attribute.name;
    valueElement.textContent = resolver.resolve(attribute.id);
    return element;
}
function newSkill(skill, resolver, template) {
    const node = document.importNode(template.content, true);
    const element = node.querySelector(".skill");
    const nameElement = node.querySelector(".skill-name");
    const scoreElement = node.querySelector(".skill-score");
    element.dataset['skill'] = skill.id;
    nameElement.textContent = skill.name;
    scoreElement.textContent = resolver.resolve(skill.id);
    return element;
}
function newItem(item, resolver, template) {
    const node = document.importNode(template.content, true);
    const element = node.querySelector(".item");
    const nameElement = node.querySelector(".item-name");
    const descElement = node.querySelector(".item-desc");
    nameElement.textContent = item.name;
    descElement.textContent = item.description;
    return element;
}
function loadDefaultData() {
    return Promise.all([
        __WEBPACK_IMPORTED_MODULE_1__application__["a" /* status */].profiles.load("./data/profiles.json", true),
        __WEBPACK_IMPORTED_MODULE_1__application__["a" /* status */].attributes.load("./data/attributes.json", true),
        __WEBPACK_IMPORTED_MODULE_1__application__["a" /* status */].skills.load("./data/skills.json", true),
    ]);
}


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_model_character__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__application__ = __webpack_require__(0);


/* harmony default export */ __webpack_exports__["a"] = (function () {
    loadCharacters();
    watchCharacters();
});
function loadCharacters() {
    const data = localStorage.getItem("characters");
    const characters = data ? JSON.parse(data) : [];
    for (const character of characters) {
        __WEBPACK_IMPORTED_MODULE_1__application__["a" /* status */].characters.add(new __WEBPACK_IMPORTED_MODULE_0_model_character__["b" /* Character */](character));
    }
}
function saveCharacters() {
    const characters = __WEBPACK_IMPORTED_MODULE_1__application__["a" /* status */].characters.list();
    const data = JSON.stringify(characters);
    localStorage.setItem("characters", data);
}
function watchCharacters() {
    __WEBPACK_IMPORTED_MODULE_1__application__["a" /* status */].characters.addListener(new class {
        onCharacterListChanged() {
            saveCharacters();
        }
    });
}


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utility__ = __webpack_require__(1);
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

class SkillSlots {
    get initial() { return (this._initial !== undefined ? this._initial : this.min); }
    get min() { return (this._min !== undefined ? this._min : 0); }
    get max() { return (this._max !== undefined ? this._max : Infinity); }
    constructor(...args) {
        if (args.length === 1 && typeof args[0] === 'object') {
            const data = args[0];
            if (data.initial !== undefined)
                this._initial = Number(data.initial);
            if (data.min !== undefined)
                this._min = Number(data.min);
            if (data.max !== undefined)
                this._max = Number(data.max);
        }
        else {
            const initial = args[0];
            const min = args[1];
            const max = args[2];
            this._initial = initial;
            this._min = min;
            this._max = max;
        }
    }
    toJSON() {
        return {
            initial: this._initial,
            min: this._min,
            max: this._max,
        };
    }
}
/* unused harmony export SkillSlots */

class ItemSlots {
    get initial() { return (this._initial !== undefined ? this._initial : this.min); }
    get min() { return (this._min !== undefined ? this._min : 0); }
    get max() { return (this._max !== undefined ? this._max : Infinity); }
    constructor(...args) {
        if (args.length === 1 && typeof args[0] === 'object') {
            const data = args[0];
            if (data.initial !== undefined)
                this._initial = Number(data.initial);
            if (data.min !== undefined)
                this._min = Number(data.min);
            if (data.max !== undefined)
                this._max = Number(data.max);
        }
        else {
            const initial = args[0];
            const min = args[1];
            const max = args[2];
            this._initial = initial;
            this._min = min;
            this._max = max;
        }
    }
    toJSON() {
        return {
            initial: this._initial,
            min: this._min,
            max: this._max,
        };
    }
}
/* unused harmony export ItemSlots */

class Profile {
    get default() { return this._default; }
    constructor(data, uuid = data.uuid || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utility__["c" /* generateUUID */])(), version = data.version || 0) {
        this.uuid = String(uuid);
        this.version = Number(version);
        this.name = String(data.name);
        this.attributes = Array.from(data.attributes).map(x => String(x));
        this.skillSlots = new SkillSlots(data.skillSlots);
        this.itemSlots = new ItemSlots(data.itemSlots);
        this._default = false;
    }
    toJSON() {
        return {
            uuid: this.uuid,
            version: this.version,
            name: this.name,
            attributes: this.attributes,
            skillSlots: this.skillSlots,
            itemSlots: this.itemSlots,
        };
    }
    markAsDefault() {
        return (this._default = true, this);
    }
}
/* unused harmony export Profile */

class ProfileManager {
    constructor() {
        this._table = Object.create(null);
    }
    contains(uuid) {
        return (uuid in this._table);
    }
    get(uuid) {
        return this._table[uuid];
    }
    list() { return Object.keys(this._table).map(x => this._table[x]); }
    add(profile) {
        const uuid = profile.uuid;
        const item = this._table[uuid];
        if (item === undefined || !item.default) {
            this._table[uuid] = profile;
        }
    }
    remove(profile) {
        const uuid = profile.uuid;
        const item = this._table[uuid];
        if (item !== undefined && !item.default) {
            delete this._table[uuid];
        }
    }
    load(url, asDefault = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utility__["b" /* requestJSON */])(url);
            for (const entry of data) {
                const profile = new Profile(entry);
                if (asDefault)
                    profile.markAsDefault();
                this.add(profile);
            }
        });
    }
    import(data) {
        if (Array.isArray(data)) {
            for (const profile of data) {
                this.add(new Profile(profile));
            }
        }
    }
    [Symbol.iterator]() {
        return this.list()[Symbol.iterator]();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ProfileManager;



/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class CompositeProvider {
    constructor(providers) {
        this.providers = Array.from(providers);
    }
    property(id) {
        for (const provider of this.providers) {
            const property = provider.property(id);
            if (property !== undefined)
                return property;
        }
        return undefined;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CompositeProvider;

class CompositeEvaluator {
    constructor(evaluators) {
        this.evaluators = Array.from(evaluators);
    }
    supports(property) {
        return this.evaluators.some(x => x.supports(property));
    }
    evaluate(property, resolver) {
        const evaluator = this.evaluators.find(x => x.supports(property));
        return (evaluator && evaluator.evaluate(property, resolver));
    }
    validate(property, resolver, value) {
        const evaluator = this.evaluators.find(x => x.supports(property));
        return (evaluator && evaluator.validate(property, resolver, value));
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = CompositeEvaluator;

class SimpleResolver {
    constructor(provider, evaluator) {
        this.provider = provider;
        this.evaluator = evaluator;
        this.clear();
    }
    resolve(id) {
        if (!(id in this._cache)) {
            this._cache[id] = undefined;
            const property = this.provider.property(id);
            if (property && this.evaluator.supports(property)) {
                const evaluated = this.evaluator.evaluate(property, this);
                const validated = this.evaluator.validate(property, this, evaluated);
                this._cache[id] = validated;
            }
        }
        return this._cache[id];
    }
    clear() {
        this._cache = Object.create(null);
    }
}
/* unused harmony export SimpleResolver */



/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_model_dice__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_model_item__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_model_character__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_model_status__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_model_dice_roll__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_view_dice_renderer__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__application__ = __webpack_require__(0);
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};







let page;
let character;
/* harmony default export */ __webpack_exports__["a"] = (function () {
    page = document.getElementById('character-edit');
    initNavigationEvent();
    initActions();
});
function initNavigationEvent() {
    __WEBPACK_IMPORTED_MODULE_6__application__["b" /* navigation */].addListener(new class {
        onEnter(page, context) {
            if (page === 'character-edit') {
                initCharacter(context instanceof __WEBPACK_IMPORTED_MODULE_2_model_character__["b" /* Character */] ? context : undefined);
            }
        }
        onExit(page) {
            if (page === 'character-edit') {
                clearElements();
            }
        }
    });
}
function clearElements() {
    page.querySelectorAll(".attributes .attribute").forEach(x => x.remove());
    page.querySelectorAll(".skills .skill").forEach(x => x.remove());
    page.querySelectorAll(".items .item").forEach(x => x.remove());
}
function initCharacter(target) {
    const supplier = target ? editCharacter(target) : newCharacter();
    supplier.then(result => {
        character = result;
        initAttributes();
        initSkills();
        initItems();
        refreshValues();
    });
}
function newCharacter() {
    return __awaiter(this, void 0, void 0, function* () {
        const sleep = (time) => new Promise(resolve => setTimeout(resolve, time));
        let profile;
        while (!(profile = __WEBPACK_IMPORTED_MODULE_6__application__["a" /* status */].profiles.list().find(x => x.default))) {
            yield sleep(1000);
        }
        return new __WEBPACK_IMPORTED_MODULE_2_model_character__["b" /* Character */](profile.uuid);
    });
}
function editCharacter(target) {
    return __awaiter(this, void 0, void 0, function* () {
        return new __WEBPACK_IMPORTED_MODULE_2_model_character__["b" /* Character */](target);
    });
}
function initAttributes() {
    const attributesElement = page.querySelector(".attributes");
    const attributeTemplate = page.querySelector(".attribute-template");
    const profile = __WEBPACK_IMPORTED_MODULE_6__application__["a" /* status */].profiles.get(character.profile);
    if (profile) {
        const attributes = __WEBPACK_IMPORTED_MODULE_6__application__["a" /* status */].attributes.get(profile.attributes);
        for (const attribute of attributes) {
            if (!attribute.hidden) {
                const attributeElement = document.importNode(attributeTemplate.content, true);
                const nameElement = attributeElement.querySelector(".name");
                const valueElement = attributeElement.querySelector(".value");
                const inputElement = attributeElement.querySelector(".input");
                nameElement.textContent = attribute.name;
                valueElement.dataset.attribute = attribute.id;
                inputElement.addEventListener('click', () => { openInputDialog(attribute); });
                if (attribute.inputs.length === 0)
                    inputElement.classList.add("no-input");
                attributesElement.appendChild(attributeElement);
            }
        }
    }
}
function initSkills() {
    const skillsElement = page.querySelector(".skills");
    const skillTemplate = page.querySelector(".skill-template");
    const profile = __WEBPACK_IMPORTED_MODULE_6__application__["a" /* status */].profiles.get(character.profile);
    if (profile) {
        const skills = character.points.skills();
        const count = Math.max(profile.skillSlots.initial, skills.length);
        for (let i = 0; i < count; i++) {
            const skillElement = document.importNode(skillTemplate.content, true);
            const idElement = skillElement.querySelector(".id");
            const pointsElement = skillElement.querySelector(".points");
            for (const skill of __WEBPACK_IMPORTED_MODULE_6__application__["a" /* status */].skills) {
                idElement.options.add(new Option(skill.name, skill.id));
            }
            if (i < skills.length) {
                idElement.value = skills[i];
                pointsElement.value = character.points.get(skills[i]).toString(10);
            }
            idElement.addEventListener('input', () => {
                refreshSkillPoints();
                refreshValues();
            });
            pointsElement.addEventListener('input', () => {
                refreshSkillPoints();
                refreshValues();
            });
            skillsElement.appendChild(skillElement);
        }
    }
}
function initItems() {
    const itemsElement = page.querySelector(".items");
    const itemTemplate = page.querySelector(".item-template");
    const profile = __WEBPACK_IMPORTED_MODULE_6__application__["a" /* status */].profiles.get(character.profile);
    if (profile) {
        const count = Math.max(profile.itemSlots.initial, character.items.length);
        for (let i = 0; i < count; i++) {
            const itemElement = document.importNode(itemTemplate.content, true);
            const nameElement = itemElement.querySelector(".name");
            const descriptionElement = itemElement.querySelector(".description");
            if (i < character.items.length) {
                const item = character.items[i];
                nameElement.value = item.name;
                descriptionElement.value = item.description;
            }
            nameElement.addEventListener('input', refreshItems);
            descriptionElement.addEventListener('input', refreshItems);
            itemsElement.appendChild(itemElement);
        }
    }
}
function initActions() {
    const actionsElement = page.querySelector(".actions");
    const okButton = actionsElement.querySelector(".ok");
    const cancelButton = actionsElement.querySelector(".cancel");
    okButton.addEventListener('click', () => {
        __WEBPACK_IMPORTED_MODULE_6__application__["a" /* status */].characters.add(character);
        __WEBPACK_IMPORTED_MODULE_6__application__["b" /* navigation */].toPage('character-management');
    });
    cancelButton.addEventListener('click', () => {
        __WEBPACK_IMPORTED_MODULE_6__application__["b" /* navigation */].toPage('character-management');
    });
}
function refreshSkillPoints() {
    const skillElements = Array.from(page.querySelectorAll(".skills .skill"));
    character.points.clear();
    for (const skillElement of skillElements) {
        const idElement = skillElement.querySelector(".id");
        const pointsElement = skillElement.querySelector(".points");
        if (idElement.validity.valid && pointsElement.validity.valid && pointsElement.value !== "") {
            const id = idElement.value;
            const points = parseInt(pointsElement.value, 10);
            character.points.set(id, points);
        }
    }
}
function refreshItems() {
    const itemElements = Array.from(page.querySelectorAll(".items .item"));
    character.items.splice(0);
    for (const itemElement of itemElements) {
        const nameElement = itemElement.querySelector(".name");
        const descriptionElement = itemElement.querySelector(".description");
        if (nameElement.validity.valid && descriptionElement.validity.valid && nameElement.value !== "") {
            const name = nameElement.value;
            const description = descriptionElement.value;
            character.items.push(new __WEBPACK_IMPORTED_MODULE_1_model_item__["a" /* Item */](name, description));
        }
    }
}
function refreshValues() {
    const attributeElements = Array.from(page.querySelectorAll(".attributes .attribute"));
    const skillElements = Array.from(page.querySelectorAll(".skills .skill"));
    const pointStatsElement = page.querySelector(".skills .point-stats");
    const characterBase = new __WEBPACK_IMPORTED_MODULE_2_model_character__["b" /* Character */](character);
    characterBase.points.clear();
    const resolver = new __WEBPACK_IMPORTED_MODULE_3_model_status__["a" /* StatusResolver */](__WEBPACK_IMPORTED_MODULE_6__application__["a" /* status */], character);
    const resolverBase = new __WEBPACK_IMPORTED_MODULE_3_model_status__["a" /* StatusResolver */](__WEBPACK_IMPORTED_MODULE_6__application__["a" /* status */], characterBase);
    for (const attributeElement of attributeElements) {
        const valueElement = attributeElement.querySelector(".value");
        const id = valueElement.dataset.attribute;
        if (id !== undefined) {
            valueElement.textContent = resolver.resolve(id, null);
        }
    }
    for (const skillElement of skillElements) {
        const idElement = skillElement.querySelector(".id");
        const baseElement = skillElement.querySelector(".base");
        const valueElement = skillElement.querySelector(".value");
        if (idElement.validity.valid) {
            const id = idElement.value;
            baseElement.textContent = resolverBase.resolve(id, null);
            valueElement.textContent = resolver.resolve(id, null);
        }
    }
    const consumedElement = pointStatsElement.querySelector(".consumed");
    const availableElement = pointStatsElement.querySelector(".available");
    const consumed = Array.from(character.points).reduce((sum, x) => sum + x[1], 0);
    const available = resolver.resolve('occupation_skill_points') + resolver.resolve('hobby_skill_points');
    consumedElement.textContent = consumed.toString(10);
    availableElement.textContent = available.toString(10);
    pointStatsElement.classList.remove('full', 'over');
    if (consumed === available)
        pointStatsElement.classList.add('full');
    else if (consumed > available)
        pointStatsElement.classList.add('over');
}
function getInputDialog() {
    return document.getElementById("character-input-dialog");
}
function openInputDialog(attribute) {
    const dialog = getInputDialog();
    if (!dialog.classList.contains("open")) {
        const contentsTemplate = dialog.querySelector(".contents-template");
        const contents = document.importNode(contentsTemplate.content, true);
        const cancelButton = contents.querySelector(".cancel");
        const okButton = contents.querySelector(".ok");
        const target = new __WEBPACK_IMPORTED_MODULE_2_model_character__["b" /* Character */](character);
        setAttribute(contents, target, attribute);
        cancelButton.addEventListener('click', () => closeInputDialog());
        okButton.addEventListener('click', () => {
            character = target;
            refreshValues();
            closeInputDialog();
        });
        dialog.appendChild(contents);
        dialog.classList.add("open");
    }
}
function closeInputDialog() {
    const dialog = getInputDialog();
    if (dialog.classList.contains("open")) {
        const contents = dialog.querySelector(".contents");
        dialog.removeChild(contents);
        dialog.classList.remove("open");
    }
}
function getInputTemplates() {
    const dialog = getInputDialog();
    return {
        dice: dialog.querySelector(".dice-input-template"),
        number: dialog.querySelector(".number-input-template"),
        text: dialog.querySelector(".text-input-template"),
    };
}
function setAttribute(contents, character, attribute) {
    const nameElement = contents.querySelector(".name");
    const expressionElement = contents.querySelector(".expression");
    const inputsElement = contents.querySelector(".inputs");
    const valueElement = contents.querySelector(".value");
    const templates = getInputTemplates();
    nameElement.textContent = attribute.name;
    expressionElement.textContent = attribute.expression;
    const resolver = new __WEBPACK_IMPORTED_MODULE_3_model_status__["a" /* StatusResolver */](__WEBPACK_IMPORTED_MODULE_6__application__["a" /* status */], character, false);
    const context = {
        character: character,
        attribute: attribute,
        update() { valueElement.textContent = resolver.resolve(this.attribute.id, null); },
    };
    for (const input of attribute.inputs) {
        inputsElement.appendChild(newInput(templates, Object.assign({ input: input }, context)));
    }
    context.update();
}
function newInput(templates, context) {
    switch (context.input.type) {
        case 'dice': return newDiceInput(templates.dice, context);
        case 'number': return newNumberInput(templates.number, context);
        case 'text': return newTextInput(templates.text, context);
        default: throw new Error('Invalid input type.');
    }
}
function newDiceInput(template, context) {
    const node = document.importNode(template.content, true);
    const inputElement = node.querySelector(".input");
    const nameElement = inputElement.querySelector(".input-name");
    const diceViewElement = inputElement.querySelector(".dice-view");
    const rollButtonElement = inputElement.querySelector(".roll-button");
    nameElement.textContent = context.input.name;
    const diceSet = __WEBPACK_IMPORTED_MODULE_0_model_dice__["b" /* DiceSet */].create(context.input.count, context.input.max);
    const value = context.character.inputs.getInput(context.attribute.id, context.input);
    if (value !== undefined)
        diceSet.values = value;
    const manager = new __WEBPACK_IMPORTED_MODULE_4_model_dice_roll__["a" /* DiceManager */]();
    manager.register("input", diceSet);
    manager.select("input");
    manager.addListener(new __WEBPACK_IMPORTED_MODULE_5_view_dice_renderer__["a" /* default */](diceViewElement, __WEBPACK_IMPORTED_MODULE_6__application__["c" /* resources */].diceImage, 'dice-group', 'dice'));
    manager.addListener(new class {
        onAttached(manager) { this.update(manager.diceSet); }
        onRoll(manager, type) { if (type === __WEBPACK_IMPORTED_MODULE_4_model_dice_roll__["b" /* DiceRollEventType */].Stop)
            this.update(manager.diceSet); }
        update(diceSet) {
            context.character.inputs.setInput(context.attribute.id, context.input, diceSet.values);
            context.update();
        }
    });
    rollButtonElement.addEventListener('click', () => { manager.roll(); });
    return inputElement;
}
function newNumberInput(template, context) {
    const node = document.importNode(template.content, true);
    const inputElement = node.querySelector(".input");
    const nameElement = inputElement.querySelector(".input-name");
    const numberInputElement = inputElement.querySelector("input");
    nameElement.textContent = context.input.name;
    if (Number.isFinite(context.input.min))
        numberInputElement.min = context.input.min.toString(10);
    if (Number.isFinite(context.input.max))
        numberInputElement.max = context.input.max.toString(10);
    if (Number.isFinite(context.input.step))
        numberInputElement.step = context.input.step.toString(10);
    numberInputElement.value = (context.character.inputs.getInput(context.attribute.id, context.input) || 0).toString(10);
    numberInputElement.addEventListener('input', () => {
        if (numberInputElement.validity.valid) {
            context.character.inputs.setInput(context.attribute.id, context.input, parseFloat(numberInputElement.value));
            context.update();
        }
    });
    return inputElement;
}
function newTextInput(template, context) {
    const node = document.importNode(template.content, true);
    const inputElement = node.querySelector(".input");
    const nameElement = inputElement.querySelector(".input-name");
    const textInputElement = inputElement.querySelector("input");
    nameElement.textContent = context.input.name;
    textInputElement.value = context.character.inputs.getInput(context.attribute.id, context.input) || "";
    textInputElement.addEventListener('input', () => {
        if (textInputElement.validity.valid) {
            context.character.inputs.setInput(context.attribute.id, context.input, textInputElement.value);
            context.update();
        }
    });
    return inputElement;
}


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_model_character__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_model_status__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_view_file__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__application__ = __webpack_require__(0);




let page;
const checked = new Set();
/* harmony default export */ __webpack_exports__["a"] = (function () {
    page = document.getElementById("character-management");
    initNavigationEvent();
    initCharacterUpdateEvent();
    initCommands();
});
function initNavigationEvent() {
    __WEBPACK_IMPORTED_MODULE_3__application__["b" /* navigation */].addListener(new class {
        onEnter(page) {
            if (page === 'character-management') {
                initCharacters();
            }
        }
        onExit(page) {
            if (page === 'character-management') {
                clearCharacters();
                clearChecks();
            }
        }
    });
}
function initCharacterUpdateEvent() {
    __WEBPACK_IMPORTED_MODULE_3__application__["a" /* status */].characters.addListener(new class {
        onCharacterListChanged(operation, target) {
            if (operation === 'remove') {
                checkCharacter(target.uuid, false);
            }
            if (__WEBPACK_IMPORTED_MODULE_3__application__["b" /* navigation */].page === 'character-management') {
                clearCharacters();
                initCharacters();
                refreshCheckState();
            }
        }
    });
}
function checkCharacter(uuid, value) {
    if (value) {
        checked.add(uuid);
    }
    else {
        checked.delete(uuid);
    }
    refreshCheckState();
}
function clearChecks() {
    checked.clear();
    refreshCheckState();
}
function refreshCheckState() {
    const characterElements = Array.from(page.querySelectorAll(".characters .character"));
    for (const characterElement of characterElements) {
        const checkElement = characterElement.querySelector(".check input");
        const uuid = characterElement.dataset['uuid'];
        checkElement.checked = uuid !== undefined && checked.has(uuid);
    }
    updateSelectionState();
}
function updateSelectionState() {
    const charactersElement = page.querySelector(".characters");
    charactersElement.classList.remove("selected", "single");
    if (checked.size !== 0)
        charactersElement.classList.add("selected");
    if (checked.size === 1)
        charactersElement.classList.add("single");
}
function initCharacters() {
    const charactersElement = page.querySelector(".characters");
    const characterTemplate = charactersElement.querySelector(".character-template");
    for (const character of __WEBPACK_IMPORTED_MODULE_3__application__["a" /* status */].characters) {
        const resolver = new __WEBPACK_IMPORTED_MODULE_1_model_status__["a" /* StatusResolver */](__WEBPACK_IMPORTED_MODULE_3__application__["a" /* status */], character);
        const node = document.importNode(characterTemplate.content, true);
        const characterElement = node.querySelector(".character");
        const checkElement = characterElement.querySelector(".check input");
        const nameElement = characterElement.querySelector(".name");
        const visibilityElement = characterElement.querySelector(".visibility");
        characterElement.dataset['uuid'] = character.uuid;
        checkElement.addEventListener('change', () => { checkCharacter(character.uuid, checkElement.checked); });
        nameElement.textContent = resolver.resolve('name');
        if (!character.visible)
            visibilityElement.classList.add('hidden');
        visibilityElement.addEventListener('click', () => {
            character.visible = !character.visible;
            __WEBPACK_IMPORTED_MODULE_3__application__["a" /* status */].characters.refresh(character);
        });
        charactersElement.appendChild(characterElement);
    }
}
function clearCharacters() {
    page.querySelectorAll(".characters .character").forEach(x => x.remove());
}
function initCommands() {
    const commandsElement = page.querySelector(".commands");
    initDeleteCommand(commandsElement);
    initCloneCommand(commandsElement);
    initEditCommand(commandsElement);
    initImportCommand(commandsElement);
    initExportCommand(commandsElement);
}
function initDeleteCommand(commands) {
    const deleteElement = commands.querySelector(".delete");
    deleteElement.addEventListener('click', () => {
        for (const character of collectCheckedCharacters()) {
            __WEBPACK_IMPORTED_MODULE_3__application__["a" /* status */].characters.remove(character);
        }
        clearChecks();
    });
}
function initCloneCommand(commands) {
    const cloneElement = commands.querySelector(".clone");
    cloneElement.addEventListener('click', () => {
        for (const character of collectCheckedCharacters()) {
            __WEBPACK_IMPORTED_MODULE_3__application__["a" /* status */].characters.add(new __WEBPACK_IMPORTED_MODULE_0_model_character__["b" /* Character */](Object.assign(character.toJSON(), { uuid: undefined })));
        }
        clearChecks();
    });
}
function initEditCommand(commands) {
    const editElement = commands.querySelector(".edit");
    editElement.addEventListener('click', () => {
        const character = getCheckedCharacter();
        if (character) {
            __WEBPACK_IMPORTED_MODULE_3__application__["b" /* navigation */].toPage('character-edit', character);
            clearChecks();
        }
    });
}
function initImportCommand(commands) {
    const importElement = commands.querySelector(".import");
    importElement.addEventListener('click', () => {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_view_file__["a" /* showLoadFileDialog */])(".json").then(file => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_view_file__["b" /* readAsText */])(file, 'utf8')).then(data => {
            __WEBPACK_IMPORTED_MODULE_3__application__["a" /* status */].import(JSON.parse(data));
        });
    });
}
function initExportCommand(commands) {
    const exportElement = commands.querySelector(".export");
    exportElement.addEventListener('click', () => {
        const characters = collectCheckedCharacters();
        const data = JSON.stringify(__WEBPACK_IMPORTED_MODULE_1_model_status__["c" /* StatusData */].create({ characters: characters }, __WEBPACK_IMPORTED_MODULE_3__application__["a" /* status */]), null, 4);
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_view_file__["c" /* showSaveFileDialog */])("characters.json", "application/json", data);
    });
}
function collectCheckedCharacters() {
    const elements = Array.from(page.querySelectorAll(".characters .character"));
    const checked = elements.filter(element => element.querySelector(".check :checked") !== null);
    const uuids = checked.map(element => element.dataset.uuid || "");
    const characters = uuids.map(uuid => __WEBPACK_IMPORTED_MODULE_3__application__["a" /* status */].characters.get(uuid));
    return characters.filter(x => x !== undefined);
}
function getCheckedCharacter() {
    const characters = collectCheckedCharacters();
    return (characters.length === 1 ? characters[0] : undefined);
}


/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__polyfill__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__page__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__storage__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__dice__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__status__ = __webpack_require__(16);





document.addEventListener("DOMContentLoaded", () => {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__polyfill__["a" /* default */])();
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__page__["a" /* default */])();
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__storage__["a" /* default */])();
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__dice__["a" /* default */])();
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__status__["a" /* default */])();
});


/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_model_dice__ = __webpack_require__(5);
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

var Status;
(function (Status) {
    Status[Status["Unloaded"] = 0] = "Unloaded";
    Status[Status["Loading"] = 1] = "Loading";
    Status[Status["Loaded"] = 2] = "Loaded";
    Status[Status["Error"] = 3] = "Error";
})(Status || (Status = {}));
class DiceImage {
    constructor(element) {
        this.element = element;
        this._status = Status.Unloaded;
        this._error = null;
        this._slices = null;
        this.loadAsync().catch(e => { this._error = e; });
    }
    get loading() { return this._status === Status.Loading; }
    get loaded() { return this._status === Status.Loaded; }
    get error() { return this._error; }
    blit(canvas, type, face) {
        if (this.loaded && this._slices) {
            const sliceSet = this._slices[type];
            if (sliceSet) {
                const slice = sliceSet[face];
                if (slice) {
                    canvas.width = slice.w;
                    canvas.height = slice.h;
                    const context = canvas.getContext('2d');
                    if (context) {
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        context.drawImage(this.element, slice.x, slice.y, slice.w, slice.h, 0, 0, canvas.width, canvas.height);
                    }
                }
            }
        }
    }
    loadAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._status === Status.Unloaded) {
                const url = this.element.dataset[DiceImage.DATA_LAYOUT];
                if (url) {
                    this._status = Status.Loading;
                    try {
                        const json = yield this.requestAsync(url);
                        this.parseJson(json);
                    }
                    catch (e) {
                        this._status = Status.Error;
                        throw e;
                    }
                    this._status = Status.Loaded;
                }
            }
        });
    }
    requestAsync(url) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'json';
            xhr.open('GET', url);
            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                }
                else {
                    reject(new Error(xhr.statusText));
                }
            };
            xhr.onerror = () => {
                reject(new Error(xhr.statusText));
            };
            xhr.send();
        });
    }
    parseJson(json) {
        const slices = Object.create(null);
        slices[__WEBPACK_IMPORTED_MODULE_0_model_dice__["a" /* DiceType */].D6] = json[__WEBPACK_IMPORTED_MODULE_0_model_dice__["a" /* DiceType */][__WEBPACK_IMPORTED_MODULE_0_model_dice__["a" /* DiceType */].D6]];
        slices[__WEBPACK_IMPORTED_MODULE_0_model_dice__["a" /* DiceType */].D10] = json[__WEBPACK_IMPORTED_MODULE_0_model_dice__["a" /* DiceType */][__WEBPACK_IMPORTED_MODULE_0_model_dice__["a" /* DiceType */].D10]];
        slices[__WEBPACK_IMPORTED_MODULE_0_model_dice__["a" /* DiceType */].D100] = json[__WEBPACK_IMPORTED_MODULE_0_model_dice__["a" /* DiceType */][__WEBPACK_IMPORTED_MODULE_0_model_dice__["a" /* DiceType */].D100]];
        this._slices = slices;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = DiceImage;

DiceImage.DATA_LAYOUT = 'layout';


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_model_dice_roll__ = __webpack_require__(3);

var Result;
(function (Result) {
    Result[Result["Normal"] = 0] = "Normal";
    Result[Result["Critical"] = 1] = "Critical";
    Result[Result["Fumble"] = 2] = "Fumble";
})(Result || (Result = {}));
class DiceNumberRenderer {
    constructor(view, critical, fumble) {
        this.view = view;
        this.critical = critical;
        this.fumble = fumble;
    }
    clear() {
        this.view.textContent = null;
    }
    onAttached(manager) {
        this.update(manager);
    }
    onDetached(manager) {
        this.clear();
    }
    onRoll(manager, type) {
        if (type === __WEBPACK_IMPORTED_MODULE_0_model_dice_roll__["b" /* DiceRollEventType */].Update) {
            this.update(manager);
        }
    }
    onDiceSetChanged(manager) {
        this.update(manager);
    }
    update(manager) {
        const diceSet = manager.diceSet;
        if (diceSet) {
            this.view.textContent = diceSet.total.toString(10);
            this.updateClass(diceSet);
        }
    }
    updateClass(diceSet) {
        const result = this.getResult(diceSet);
        this.setClass(this.critical, result === Result.Critical);
        this.setClass(this.fumble, result === Result.Fumble);
    }
    getResult(diceSet) {
        if (diceSet.size === 1 && diceSet.max === 100) {
            const value = diceSet.total;
            if (value <= 5)
                return Result.Critical;
            if (value > 95)
                return Result.Fumble;
        }
        return Result.Normal;
    }
    setClass(clazz, condition) {
        if (clazz) {
            if (condition) {
                this.view.classList.add(clazz);
            }
            else {
                this.view.classList.remove(clazz);
            }
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = DiceNumberRenderer;



/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = showLoadFileDialog;
/* harmony export (immutable) */ __webpack_exports__["c"] = showSaveFileDialog;
/* harmony export (immutable) */ __webpack_exports__["b"] = readAsText;
function showLoadFileDialog(accept, multiple) {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = "file";
        input.accept = accept;
        input.addEventListener('change', () => {
            if (input.files !== null && input.files.length !== 0) {
                if (multiple) {
                    resolve(input.files);
                }
                else {
                    resolve(input.files[0]);
                }
            }
            else {
                reject("File(s) not selected.");
            }
        });
        if (!triggerClickEvent(input)) {
            reject(new Error("'click' event canceled."));
        }
    });
}
function showSaveFileDialog(name, type, data) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([data], { type: type }));
    a.download = name;
    triggerClickEvent(a);
}
function readAsText(blob, encoding) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => { resolve(reader.result); });
        reader.addEventListener('error', () => { reject(reader.error); });
        reader.readAsText(blob, encoding);
    });
}
function triggerClickEvent(target) {
    return target.dispatchEvent(new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
    }));
}


/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class PageManager {
    constructor(page) {
        this._listeners = [];
        this._page = page;
    }
    get page() { return this._page; }
    addListener(listener) {
        const index = this._listeners.indexOf(listener);
        if (index === -1) {
            this._listeners.push(listener);
            if (listener.onEnter)
                listener.onEnter(this.page);
        }
    }
    removeListener(listener) {
        const index = this._listeners.indexOf(listener);
        if (index !== -1) {
            this._listeners.splice(index, 1);
            if (listener.onExit)
                listener.onExit(this.page);
        }
    }
    toPage(next, context, force = false) {
        if (this._page !== next || force) {
            for (const listener of this._listeners) {
                if (listener.onExit)
                    listener.onExit(this.page, this._context);
            }
            this._page = next;
            this._context = context;
            for (const listener of this._listeners) {
                if (listener.onEnter)
                    listener.onEnter(this.page, this._context);
            }
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PageManager;



/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// Copyright (C) 2016 Dmitry Chestnykh
// MIT License. See LICENSE file for details.
Object.defineProperty(exports, "__esModule", { value: true });
function encode(s) {
    // Calculate result length and allocate output array.
    // encodedLength() also validates string and throws errors,
    // so we don't need repeat validation here.
    var arr = new Uint8Array(encodedLength(s));
    var pos = 0;
    for (var i = 0; i < s.length; i++) {
        var c = s.charCodeAt(i);
        if (c < 0x80) {
            arr[pos++] = c;
        }
        else if (c < 0x800) {
            arr[pos++] = 0xc0 | c >> 6;
            arr[pos++] = 0x80 | c & 0x3f;
        }
        else if (c < 0xd800) {
            arr[pos++] = 0xe0 | c >> 12;
            arr[pos++] = 0x80 | (c >> 6) & 0x3f;
            arr[pos++] = 0x80 | c & 0x3f;
        }
        else {
            i++; // get one more character
            c = (c & 0x3ff) << 10;
            c |= s.charCodeAt(i) & 0x3ff;
            c += 0x10000;
            arr[pos++] = 0xf0 | c >> 18;
            arr[pos++] = 0x80 | (c >> 12) & 0x3f;
            arr[pos++] = 0x80 | (c >> 6) & 0x3f;
            arr[pos++] = 0x80 | c & 0x3f;
        }
    }
    return arr;
}
exports.encode = encode;
function encodedLength(s) {
    var result = 0;
    for (var i = 0; i < s.length; ++i) {
        var c = s.charCodeAt(i);
        if (c < 0x80) {
            result += 1;
        }
        else if (c < 0x800) {
            result += 2;
        }
        else if (c < 0xd800) {
            result += 3;
        }
        else if (c <= 0xdfff) {
            if (i >= s.length - 1) {
                throw new Error("utf8: invalid source string");
            }
            i++; // "eat" next character
            result += 4;
        }
        else {
            throw new Error("utf8: invalid source string");
        }
    }
    return result;
}
exports.encodedLength = encodedLength;
function decode(arr) {
    var chars = [];
    var pos = 0;
    while (pos < arr.length) {
        var b = arr[pos++];
        if (b & 0x80) {
            if (b < 0xe0) {
                // Need 1 more byte.
                if (pos >= arr.length) {
                    throw new Error("utf8: invalid source encoding");
                }
                var n1 = arr[pos++];
                b = (b & 0x1f) << 6 | (n1 & 0x3f);
            }
            else if (b < 0xf0) {
                // Need 2 more bytes.
                if (pos >= arr.length - 1) {
                    throw new Error("utf8: invalid source encoding");
                }
                var n1 = arr[pos++];
                var n2 = arr[pos++];
                b = (b & 0x0f) << 12 | (n1 & 0x3f) << 6 | (n2 & 0x3f);
            }
            else {
                // Need 3 more bytes.
                if (pos >= arr.length - 2) {
                    throw new Error("utf8: invalid source encoding");
                }
                var n1 = arr[pos++];
                var n2 = arr[pos++];
                var n3 = arr[pos++];
                b = (b & 0x0f) << 18 | (n1 & 0x3f) << 12 | (n2 & 0x3f) << 6 | (n3 & 0x3f);
            }
        }
        if (b < 0x10000) {
            chars.push(b);
        }
        else {
            // Surrogate pair.
            b -= 0x10000;
            chars.push(0xd800 | (b >> 10));
            chars.push(0xdc00 | (b & 0x3ff));
        }
    }
    return String.fromCharCode.apply(null, chars);
}
exports.decode = decode;
//# sourceMappingURL=utf8.js.map

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

(function (global, factory) {
	 true ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.exprEval = factory());
}(this, (function () { 'use strict';

/*!
 Based on ndef.parser, by Raphael Graf(r@undefined.ch)
 http://www.undefined.ch/mparser/index.html

 Ported to JavaScript and modified by Matthew Crumley (email@matthewcrumley.com, http://silentmatt.com/)

 You are free to use and modify this code in anyway you find useful. Please leave this comment in the code
 to acknowledge its original source. If you feel like it, I enjoy hearing about projects that use my code,
 but don't feel like you have to let me know or ask permission.
*/

function indexOf(array, obj) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] === obj) {
      return i;
    }
  }
  return -1;
}

var INUMBER = 'INUMBER';
var IOP1 = 'IOP1';
var IOP2 = 'IOP2';
var IOP3 = 'IOP3';
var IVAR = 'IVAR';
var IFUNCALL = 'IFUNCALL';
var IEXPR = 'IEXPR';
var IMEMBER = 'IMEMBER';

function Instruction(type, value) {
  this.type = type;
  this.value = (value !== undefined && value !== null) ? value : 0;
}

Instruction.prototype.toString = function () {
  switch (this.type) {
    case INUMBER:
    case IOP1:
    case IOP2:
    case IOP3:
    case IVAR:
      return this.value;
    case IFUNCALL:
      return 'CALL ' + this.value;
    case IMEMBER:
      return '.' + this.value;
    default:
      return 'Invalid Instruction';
  }
};

function Expression(tokens, parser) {
  this.tokens = tokens;
  this.parser = parser;
  this.unaryOps = parser.unaryOps;
  this.binaryOps = parser.binaryOps;
  this.ternaryOps = parser.ternaryOps;
  this.functions = parser.functions;
}

function escapeValue(v) {
  if (typeof v === 'string') {
    return JSON.stringify(v).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  }
  return v;
}

function simplify(tokens, unaryOps, binaryOps, ternaryOps, values) {
  var nstack = [];
  var newexpression = [];
  var n1, n2, n3;
  var f;
  for (var i = 0, L = tokens.length; i < L; i++) {
    var item = tokens[i];
    var type = item.type;
    if (type === INUMBER) {
      nstack.push(item);
    } else if (type === IVAR && values.hasOwnProperty(item.value)) {
      item = new Instruction(INUMBER, values[item.value]);
      nstack.push(item);
    } else if (type === IOP2 && nstack.length > 1) {
      n2 = nstack.pop();
      n1 = nstack.pop();
      f = binaryOps[item.value];
      item = new Instruction(INUMBER, f(n1.value, n2.value));
      nstack.push(item);
    } else if (type === IOP3 && nstack.length > 2) {
      n3 = nstack.pop();
      n2 = nstack.pop();
      n1 = nstack.pop();
      if (item.value === '?') {
        nstack.push(n1.value ? n2.value : n3.value);
      } else {
        f = ternaryOps[item.value];
        item = new Instruction(INUMBER, f(n1.value, n2.value, n3.value));
        nstack.push(item);
      }
    } else if (type === IOP1 && nstack.length > 0) {
      n1 = nstack.pop();
      f = unaryOps[item.value];
      item = new Instruction(INUMBER, f(n1.value));
      nstack.push(item);
    } else if (type === IEXPR) {
      while (nstack.length > 0) {
        newexpression.push(nstack.shift());
      }
      newexpression.push(new Instruction(IEXPR, simplify(item.value, unaryOps, binaryOps, ternaryOps, values)));
    } else if (type === IMEMBER && nstack.length > 0) {
      n1 = nstack.pop();
      nstack.push(new Instruction(INUMBER, n1.value[item.value]));
    } else {
      while (nstack.length > 0) {
        newexpression.push(nstack.shift());
      }
      newexpression.push(item);
    }
  }
  while (nstack.length > 0) {
    newexpression.push(nstack.shift());
  }
  return newexpression;
}

Expression.prototype.simplify = function (values) {
  values = values || {};
  return new Expression(simplify(this.tokens, this.unaryOps, this.binaryOps, this.ternaryOps, values), this.parser);
};

function substitute(tokens, variable, expr) {
  var newexpression = [];
  for (var i = 0, L = tokens.length; i < L; i++) {
    var item = tokens[i];
    var type = item.type;
    if (type === IVAR && item.value === variable) {
      for (var j = 0; j < expr.tokens.length; j++) {
        var expritem = expr.tokens[j];
        var replitem;
        if (expritem.type === IOP1) {
          replitem = unaryInstruction(expritem.value);
        } else if (expritem.type === IOP2) {
          replitem = binaryInstruction(expritem.value);
        } else if (expritem.type === IOP3) {
          replitem = ternaryInstruction(expritem.value);
        } else {
          replitem = new Instruction(expritem.type, expritem.value);
        }
        newexpression.push(replitem);
      }
    } else if (type === IEXPR) {
      newexpression.push(new Instruction(IEXPR, substitute(item.value, variable, expr)));
    } else {
      newexpression.push(item);
    }
  }
  return newexpression;
}

Expression.prototype.substitute = function (variable, expr) {
  if (!(expr instanceof Expression)) {
    expr = this.parser.parse(String(expr));
  }

  return new Expression(substitute(this.tokens, variable, expr), this.parser);
};

function evaluate(tokens, expr, values) {
  var nstack = [];
  var n1, n2, n3;
  var f;
  for (var i = 0, L = tokens.length; i < L; i++) {
    var item = tokens[i];
    var type = item.type;
    if (type === INUMBER) {
      nstack.push(item.value);
    } else if (type === IOP2) {
      n2 = nstack.pop();
      n1 = nstack.pop();
      f = expr.binaryOps[item.value];
      nstack.push(f(n1, n2));
    } else if (type === IOP3) {
      n3 = nstack.pop();
      n2 = nstack.pop();
      n1 = nstack.pop();
      if (item.value === '?') {
        nstack.push(evaluate(n1 ? n2 : n3, expr, values));
      } else {
        f = expr.ternaryOps[item.value];
        nstack.push(f(n1, n2, n3));
      }
    } else if (type === IVAR) {
      if (item.value in expr.functions) {
        nstack.push(expr.functions[item.value]);
      } else {
        var v = values[item.value];
        if (v !== undefined) {
          nstack.push(v);
        } else {
          throw new Error('undefined variable: ' + item.value);
        }
      }
    } else if (type === IOP1) {
      n1 = nstack.pop();
      f = expr.unaryOps[item.value];
      nstack.push(f(n1));
    } else if (type === IFUNCALL) {
      var argCount = item.value;
      var args = [];
      while (argCount-- > 0) {
        args.unshift(nstack.pop());
      }
      f = nstack.pop();
      if (f.apply && f.call) {
        nstack.push(f.apply(undefined, args));
      } else {
        throw new Error(f + ' is not a function');
      }
    } else if (type === IEXPR) {
      nstack.push(item.value);
    } else if (type === IMEMBER) {
      n1 = nstack.pop();
      nstack.push(n1[item.value]);
    } else {
      throw new Error('invalid Expression');
    }
  }
  if (nstack.length > 1) {
    throw new Error('invalid Expression (parity)');
  }
  return nstack[0];
}

Expression.prototype.evaluate = function (values) {
  values = values || {};
  return evaluate(this.tokens, this, values);
};

function expressionToString(tokens, toJS) {
  var nstack = [];
  var n1, n2, n3;
  var f;
  for (var i = 0, L = tokens.length; i < L; i++) {
    var item = tokens[i];
    var type = item.type;
    if (type === INUMBER) {
      if (typeof item.value === 'number' && item.value < 0) {
        nstack.push('(' + item.value + ')');
      } else {
        nstack.push(escapeValue(item.value));
      }
    } else if (type === IOP2) {
      n2 = nstack.pop();
      n1 = nstack.pop();
      f = item.value;
      if (toJS) {
        if (f === '^') {
          nstack.push('Math.pow(' + n1 + ', ' + n2 + ')');
        } else if (f === 'and') {
          nstack.push('(!!' + n1 + ' && !!' + n2 + ')');
        } else if (f === 'or') {
          nstack.push('(!!' + n1 + ' || !!' + n2 + ')');
        } else if (f === '||') {
          nstack.push('(String(' + n1 + ') + String(' + n2 + '))');
        } else if (f === '==') {
          nstack.push('(' + n1 + ' === ' + n2 + ')');
        } else if (f === '!=') {
          nstack.push('(' + n1 + ' !== ' + n2 + ')');
        } else {
          nstack.push('(' + n1 + ' ' + f + ' ' + n2 + ')');
        }
      } else {
        nstack.push('(' + n1 + ' ' + f + ' ' + n2 + ')');
      }
    } else if (type === IOP3) {
      n3 = nstack.pop();
      n2 = nstack.pop();
      n1 = nstack.pop();
      f = item.value;
      if (f === '?') {
        nstack.push('(' + n1 + ' ? ' + n2 + ' : ' + n3 + ')');
      } else {
        throw new Error('invalid Expression');
      }
    } else if (type === IVAR) {
      nstack.push(item.value);
    } else if (type === IOP1) {
      n1 = nstack.pop();
      f = item.value;
      if (f === '-' || f === '+') {
        nstack.push('(' + f + n1 + ')');
      } else if (toJS) {
        if (f === 'not') {
          nstack.push('(' + '!' + n1 + ')');
        } else if (f === '!') {
          nstack.push('fac(' + n1 + ')');
        } else {
          nstack.push(f + '(' + n1 + ')');
        }
      } else if (f === '!') {
        nstack.push('(' + n1 + '!)');
      } else {
        nstack.push('(' + f + ' ' + n1 + ')');
      }
    } else if (type === IFUNCALL) {
      var argCount = item.value;
      var args = [];
      while (argCount-- > 0) {
        args.unshift(nstack.pop());
      }
      f = nstack.pop();
      nstack.push(f + '(' + args.join(', ') + ')');
    } else if (type === IMEMBER) {
      n1 = nstack.pop();
      nstack.push(n1 + '.' + item.value);
    } else if (type === IEXPR) {
      nstack.push('(' + expressionToString(item.value, toJS) + ')');
    } else {
      throw new Error('invalid Expression');
    }
  }
  if (nstack.length > 1) {
    throw new Error('invalid Expression (parity)');
  }
  return nstack[0];
}

Expression.prototype.toString = function () {
  return expressionToString(this.tokens, false);
};

function getSymbols(tokens, symbols) {
  for (var i = 0, L = tokens.length; i < L; i++) {
    var item = tokens[i];
    if (item.type === IVAR && (indexOf(symbols, item.value) === -1)) {
      symbols.push(item.value);
    } else if (item.type === IEXPR) {
      getSymbols(item.value, symbols);
    }
  }
}

Expression.prototype.symbols = function () {
  var vars = [];
  getSymbols(this.tokens, vars);
  return vars;
};

Expression.prototype.variables = function () {
  var vars = [];
  getSymbols(this.tokens, vars);
  var functions = this.functions;
  return vars.filter(function (name) {
    return !(name in functions);
  });
};

Expression.prototype.toJSFunction = function (param, variables) {
  var expr = this;
  var f = new Function(param, 'with(this.functions) with (this.ternaryOps) with (this.binaryOps) with (this.unaryOps) { return ' + expressionToString(this.simplify(variables).tokens, true) + '; }'); // eslint-disable-line no-new-func
  return function () {
    return f.apply(expr, arguments);
  };
};

function add(a, b) {
  return Number(a) + Number(b);
}
function sub(a, b) {
  return a - b;
}
function mul(a, b) {
  return a * b;
}
function div(a, b) {
  return a / b;
}
function mod(a, b) {
  return a % b;
}
function concat(a, b) {
  return '' + a + b;
}
function equal(a, b) {
  return a === b;
}
function notEqual(a, b) {
  return a !== b;
}
function greaterThan(a, b) {
  return a > b;
}
function lessThan(a, b) {
  return a < b;
}
function greaterThanEqual(a, b) {
  return a >= b;
}
function lessThanEqual(a, b) {
  return a <= b;
}
function andOperator(a, b) {
  return Boolean(a && b);
}
function orOperator(a, b) {
  return Boolean(a || b);
}
function sinh(a) {
  return ((Math.exp(a) - Math.exp(-a)) / 2);
}
function cosh(a) {
  return ((Math.exp(a) + Math.exp(-a)) / 2);
}
function tanh(a) {
  if (a === Infinity) return 1;
  if (a === -Infinity) return -1;
  return (Math.exp(a) - Math.exp(-a)) / (Math.exp(a) + Math.exp(-a));
}
function asinh(a) {
  if (a === -Infinity) return a;
  return Math.log(a + Math.sqrt(a * a + 1));
}
function acosh(a) {
  return Math.log(a + Math.sqrt(a * a - 1));
}
function atanh(a) {
  return (Math.log((1 + a) / (1 - a)) / 2);
}
function log10(a) {
  return Math.log(a) * Math.LOG10E;
}
function neg(a) {
  return -a;
}
function not(a) {
  return !a;
}
function trunc(a) {
  return a < 0 ? Math.ceil(a) : Math.floor(a);
}
function random(a) {
  return Math.random() * (a || 1);
}
function factorial(a) { // a!
  return gamma(a + 1);
}
function stringLength(s) {
  return String(s).length;
}

function hypot() {
  var sum = 0;
  var larg = 0;
  for (var i = 0, L = arguments.length; i < L; i++) {
    var arg = Math.abs(arguments[i]);
    var div;
    if (larg < arg) {
      div = larg / arg;
      sum = sum * div * div + 1;
      larg = arg;
    } else if (arg > 0) {
      div = arg / larg;
      sum += div * div;
    } else {
      sum += arg;
    }
  }
  return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
}

function condition(cond, yep, nope) {
  return cond ? yep : nope;
}

function isInteger(value) {
  return isFinite(value) && (value === Math.round(value));
}

var GAMMA_G = 4.7421875;
var GAMMA_P = [
  0.99999999999999709182,
  57.156235665862923517, -59.597960355475491248,
  14.136097974741747174, -0.49191381609762019978,
  0.33994649984811888699e-4,
  0.46523628927048575665e-4, -0.98374475304879564677e-4,
  0.15808870322491248884e-3, -0.21026444172410488319e-3,
  0.21743961811521264320e-3, -0.16431810653676389022e-3,
  0.84418223983852743293e-4, -0.26190838401581408670e-4,
  0.36899182659531622704e-5
];

// Gamma function from math.js
function gamma(n) {
  var t, x;

  if (isInteger(n)) {
    if (n <= 0) {
      return isFinite(n) ? Infinity : NaN;
    }

    if (n > 171) {
      return Infinity; // Will overflow
    }

    var value = n - 2;
    var res = n - 1;
    while (value > 1) {
      res *= value;
      value--;
    }

    if (res === 0) {
      res = 1; // 0! is per definition 1
    }

    return res;
  }

  if (n < 0.5) {
    return Math.PI / (Math.sin(Math.PI * n) * gamma(1 - n));
  }

  if (n >= 171.35) {
    return Infinity; // will overflow
  }

  if (n > 85.0) { // Extended Stirling Approx
    var twoN = n * n;
    var threeN = twoN * n;
    var fourN = threeN * n;
    var fiveN = fourN * n;
    return Math.sqrt(2 * Math.PI / n) * Math.pow((n / Math.E), n) *
      (1 + 1 / (12 * n) + 1 / (288 * twoN) - 139 / (51840 * threeN) -
      571 / (2488320 * fourN) + 163879 / (209018880 * fiveN) +
      5246819 / (75246796800 * fiveN * n));
  }

  --n;
  x = GAMMA_P[0];
  for (var i = 1; i < GAMMA_P.length; ++i) {
    x += GAMMA_P[i] / (n + i);
  }

  t = n + GAMMA_G + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, n + 0.5) * Math.exp(-t) * x;
}

var TEOF = 'TEOF';
var TOP = 'TOP';
var TNUMBER = 'TNUMBER';
var TSTRING = 'TSTRING';
var TPAREN = 'TPAREN';
var TCOMMA = 'TCOMMA';
var TNAME = 'TNAME';

function Token(type, value, line, column) {
  this.type = type;
  this.value = value;
  this.line = line;
  this.column = column;
}

Token.prototype.toString = function () {
  return this.type + ': ' + this.value;
};

function TokenStream(expression, unaryOps, binaryOps, ternaryOps, consts) {
  this.pos = 0;
  this.line = 0;
  this.column = 0;
  this.current = null;
  this.unaryOps = unaryOps;
  this.binaryOps = binaryOps;
  this.ternaryOps = ternaryOps;
  this.consts = consts;
  this.expression = expression;
  this.savedPosition = 0;
  this.savedCurrent = null;
  this.savedLine = 0;
  this.savedColumn = 0;
}

TokenStream.prototype.newToken = function (type, value, line, column) {
  return new Token(type, value, line != null ? line : this.line, column != null ? column : this.column);
};

TokenStream.prototype.save = function () {
  this.savedPosition = this.pos;
  this.savedCurrent = this.current;
  this.savedLine = this.line;
  this.savedColumn = this.column;
};

TokenStream.prototype.restore = function () {
  this.pos = this.savedPosition;
  this.current = this.savedCurrent;
  this.line = this.savedLine;
  this.column = this.savedColumn;
};

TokenStream.prototype.next = function () {
  if (this.pos >= this.expression.length) {
    return this.newToken(TEOF, 'EOF');
  }

  if (this.isWhitespace() || this.isComment()) {
    return this.next();
  } else if (this.isNumber() ||
      this.isOperator() ||
      this.isString() ||
      this.isParen() ||
      this.isComma() ||
      this.isNamedOp() ||
      this.isConst() ||
      this.isName()) {
    return this.current;
  } else {
    this.parseError('Unknown character "' + this.expression.charAt(this.pos) + '"');
  }
};

TokenStream.prototype.isString = function () {
  var r = false;
  var startLine = this.line;
  var startColumn = this.column;
  var startPos = this.pos;
  var quote = this.expression.charAt(startPos);

  if (quote === '\'' || quote === '"') {
    this.pos++;
    this.column++;
    var index = this.expression.indexOf(quote, startPos + 1);
    while (index >= 0 && this.pos < this.expression.length) {
      this.pos = index + 1;
      if (this.expression.charAt(index - 1) !== '\\') {
        var rawString = this.expression.substring(startPos + 1, index);
        this.current = this.newToken(TSTRING, this.unescape(rawString), startLine, startColumn);
        var newLine = rawString.indexOf('\n');
        var lastNewline = -1;
        while (newLine >= 0) {
          this.line++;
          this.column = 0;
          lastNewline = newLine;
          newLine = rawString.indexOf('\n', newLine + 1);
        }
        this.column += rawString.length - lastNewline;
        r = true;
        break;
      }
      index = this.expression.indexOf(quote, index + 1);
    }
  }
  return r;
};

TokenStream.prototype.isParen = function () {
  var char = this.expression.charAt(this.pos);
  if (char === '(' || char === ')') {
    this.current = this.newToken(TPAREN, char);
    this.pos++;
    this.column++;
    return true;
  }
  return false;
};

TokenStream.prototype.isComma = function () {
  var char = this.expression.charAt(this.pos);
  if (char === ',') {
    this.current = this.newToken(TCOMMA, ',');
    this.pos++;
    this.column++;
    return true;
  }
  return false;
};

TokenStream.prototype.isConst = function () {
  var startPos = this.pos;
  var i = startPos;
  for (; i < this.expression.length; i++) {
    var c = this.expression.charAt(i);
    if (c.toUpperCase() === c.toLowerCase()) {
      if (i === this.pos || (c !== '_' && c !== '.' && (c < '0' || c > '9'))) {
        break;
      }
    }
  }
  if (i > startPos) {
    var str = this.expression.substring(startPos, i);
    if (str in this.consts) {
      this.current = this.newToken(TNUMBER, this.consts[str]);
      this.pos += str.length;
      this.column += str.length;
      return true;
    }
  }
  return false;
};

TokenStream.prototype.isNamedOp = function () {
  var startPos = this.pos;
  var i = startPos;
  for (; i < this.expression.length; i++) {
    var c = this.expression.charAt(i);
    if (c.toUpperCase() === c.toLowerCase()) {
      if (i === this.pos || (c !== '_' && (c < '0' || c > '9'))) {
        break;
      }
    }
  }
  if (i > startPos) {
    var str = this.expression.substring(startPos, i);
    if (str in this.binaryOps || str in this.unaryOps || str in this.ternaryOps) {
      this.current = this.newToken(TOP, str);
      this.pos += str.length;
      this.column += str.length;
      return true;
    }
  }
  return false;
};

TokenStream.prototype.isName = function () {
  var startPos = this.pos;
  var i = startPos;
  for (; i < this.expression.length; i++) {
    var c = this.expression.charAt(i);
    if (c.toUpperCase() === c.toLowerCase()) {
      if (i === this.pos || (c !== '_' && (c < '0' || c > '9'))) {
        break;
      }
    }
  }
  if (i > startPos) {
    var str = this.expression.substring(startPos, i);
    this.current = this.newToken(TNAME, str);
    this.pos += str.length;
    this.column += str.length;
    return true;
  }
  return false;
};

TokenStream.prototype.isWhitespace = function () {
  var r = false;
  var char = this.expression.charAt(this.pos);
  while (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
    r = true;
    this.pos++;
    this.column++;
    if (char === '\n') {
      this.line++;
      this.column = 0;
    }
    if (this.pos >= this.expression.length) {
      break;
    }
    char = this.expression.charAt(this.pos);
  }
  return r;
};

var codePointPattern = /^[0-9a-f]{4}$/i;

TokenStream.prototype.unescape = function (v) {
  var index = v.indexOf('\\');
  if (index < 0) {
    return v;
  }

  var buffer = v.substring(0, index);
  while (index >= 0) {
    var c = v.charAt(++index);
    switch (c) {
      case '\'':
        buffer += '\'';
        break;
      case '"':
        buffer += '"';
        break;
      case '\\':
        buffer += '\\';
        break;
      case '/':
        buffer += '/';
        break;
      case 'b':
        buffer += '\b';
        break;
      case 'f':
        buffer += '\f';
        break;
      case 'n':
        buffer += '\n';
        break;
      case 'r':
        buffer += '\r';
        break;
      case 't':
        buffer += '\t';
        break;
      case 'u':
        // interpret the following 4 characters as the hex of the unicode code point
        var codePoint = v.substring(index + 1, index + 5);
        if (!codePointPattern.test(codePoint)) {
          this.parseError('Illegal escape sequence: \\u' + codePoint);
        }
        buffer += String.fromCharCode(parseInt(codePoint, 16));
        index += 4;
        break;
      default:
        throw this.parseError('Illegal escape sequence: "\\' + c + '"');
    }
    ++index;
    var backslash = v.indexOf('\\', index);
    buffer += v.substring(index, backslash < 0 ? v.length : backslash);
    index = backslash;
  }

  return buffer;
};

TokenStream.prototype.isComment = function () {
  var char = this.expression.charAt(this.pos);
  if (char === '/' && this.expression.charAt(this.pos + 1) === '*') {
    var startPos = this.pos;
    this.pos = this.expression.indexOf('*/', this.pos) + 2;
    if (this.pos === 1) {
      this.pos = this.expression.length;
    }
    var comment = this.expression.substring(startPos, this.pos);
    var newline = comment.indexOf('\n');
    while (newline >= 0) {
      this.line++;
      this.column = comment.length - newline;
      newline = comment.indexOf('\n', newline + 1);
    }
    return true;
  }
  return false;
};

TokenStream.prototype.isNumber = function () {
  var valid = false;
  var pos = this.pos;
  var startPos = pos;
  var resetPos = pos;
  var column = this.column;
  var resetColumn = column;
  var foundDot = false;
  var foundDigits = false;
  var char;

  while (pos < this.expression.length) {
    char = this.expression.charAt(pos);
    if ((char >= '0' && char <= '9') || (!foundDot && char === '.')) {
      if (char === '.') {
        foundDot = true;
      } else {
        foundDigits = true;
      }
      pos++;
      column++;
      valid = foundDigits;
    } else {
      break;
    }
  }

  if (valid) {
    resetPos = pos;
    resetColumn = column;
  }

  if (char === 'e' || char === 'E') {
    pos++;
    column++;
    var acceptSign = true;
    var validExponent = false;
    while (pos < this.expression.length) {
      char = this.expression.charAt(pos);
      if (acceptSign && (char === '+' || char === '-')) {
        acceptSign = false;
      } else if (char >= '0' && char <= '9') {
        validExponent = true;
        acceptSign = false;
      } else {
        break;
      }
      pos++;
      column++;
    }

    if (!validExponent) {
      pos = resetPos;
      column = resetColumn;
    }
  }

  if (valid) {
    this.current = this.newToken(TNUMBER, parseFloat(this.expression.substring(startPos, pos)));
    this.pos = pos;
    this.column = column;
  } else {
    this.pos = resetPos;
    this.column = resetColumn;
  }
  return valid;
};

TokenStream.prototype.isOperator = function () {
  var char = this.expression.charAt(this.pos);

  if (char === '+' || char === '-' || char === '*' || char === '/' || char === '%' || char === '^' || char === '?' || char === ':' || char === '.') {
    this.current = this.newToken(TOP, char);
  } else if (char === '∙' || char === '•') {
    this.current = this.newToken(TOP, '*');
  } else if (char === '>') {
    if (this.expression.charAt(this.pos + 1) === '=') {
      this.current = this.newToken(TOP, '>=');
      this.pos++;
      this.column++;
    } else {
      this.current = this.newToken(TOP, '>');
    }
  } else if (char === '<') {
    if (this.expression.charAt(this.pos + 1) === '=') {
      this.current = this.newToken(TOP, '<=');
      this.pos++;
      this.column++;
    } else {
      this.current = this.newToken(TOP, '<');
    }
  } else if (char === '|') {
    if (this.expression.charAt(this.pos + 1) === '|') {
      this.current = this.newToken(TOP, '||');
      this.pos++;
      this.column++;
    } else {
      return false;
    }
  } else if (char === '=') {
    if (this.expression.charAt(this.pos + 1) === '=') {
      this.current = this.newToken(TOP, '==');
      this.pos++;
      this.column++;
    } else {
      return false;
    }
  } else if (char === '!') {
    if (this.expression.charAt(this.pos + 1) === '=') {
      this.current = this.newToken(TOP, '!=');
      this.pos++;
      this.column++;
    } else {
      this.current = this.newToken(TOP, char);
    }
  } else {
    return false;
  }
  this.pos++;
  this.column++;
  return true;
};

TokenStream.prototype.parseError = function (msg) {
  throw new Error('parse error [' + (this.line + 1) + ':' + (this.column + 1) + ']: ' + msg);
};

function unaryInstruction(value) {
  return new Instruction(IOP1, value);
}

function binaryInstruction(value) {
  return new Instruction(IOP2, value);
}

function ternaryInstruction(value) {
  return new Instruction(IOP3, value);
}

function ParserState(parser, tokenStream) {
  this.parser = parser;
  this.tokens = tokenStream;
  this.current = null;
  this.nextToken = null;
  this.next();
  this.savedCurrent = null;
  this.savedNextToken = null;
}

ParserState.prototype.next = function () {
  this.current = this.nextToken;
  return (this.nextToken = this.tokens.next());
};

ParserState.prototype.tokenMatches = function (token, value) {
  if (typeof value === 'undefined') {
    return true;
  } else if (Array.isArray(value)) {
    return indexOf(value, token.value) >= 0;
  } else if (typeof value === 'function') {
    return value(token);
  } else {
    return token.value === value;
  }
};

ParserState.prototype.save = function () {
  this.savedCurrent = this.current;
  this.savedNextToken = this.nextToken;
  this.tokens.save();
};

ParserState.prototype.restore = function () {
  this.tokens.restore();
  this.current = this.savedCurrent;
  this.nextToken = this.savedNextToken;
};

ParserState.prototype.accept = function (type, value) {
  if (this.nextToken.type === type && this.tokenMatches(this.nextToken, value)) {
    this.next();
    return true;
  }
  return false;
};

ParserState.prototype.expect = function (type, value) {
  if (!this.accept(type, value)) {
    throw new Error('parse error [' + this.tokens.line + ':' + this.tokens.column + ']: Expected ' + (value || type));
  }
};

ParserState.prototype.parseAtom = function (instr) {
  if (this.accept(TNAME)) {
    instr.push(new Instruction(IVAR, this.current.value));
  } else if (this.accept(TNUMBER)) {
    instr.push(new Instruction(INUMBER, this.current.value));
  } else if (this.accept(TSTRING)) {
    instr.push(new Instruction(INUMBER, this.current.value));
  } else if (this.accept(TPAREN, '(')) {
    this.parseExpression(instr);
    this.expect(TPAREN, ')');
  } else {
    throw new Error('unexpected ' + this.nextToken);
  }
};

ParserState.prototype.parseExpression = function (instr) {
  this.parseConditionalExpression(instr);
};

ParserState.prototype.parseConditionalExpression = function (instr) {
  this.parseOrExpression(instr);
  while (this.accept(TOP, '?')) {
    var trueBranch = [];
    var falseBranch = [];
    this.parseConditionalExpression(trueBranch);
    this.expect(TOP, ':');
    this.parseConditionalExpression(falseBranch);
    instr.push(new Instruction(IEXPR, trueBranch));
    instr.push(new Instruction(IEXPR, falseBranch));
    instr.push(ternaryInstruction('?'));
  }
};

ParserState.prototype.parseOrExpression = function (instr) {
  this.parseAndExpression(instr);
  while (this.accept(TOP, 'or')) {
    this.parseAndExpression(instr);
    instr.push(binaryInstruction('or'));
  }
};

ParserState.prototype.parseAndExpression = function (instr) {
  this.parseComparison(instr);
  while (this.accept(TOP, 'and')) {
    this.parseComparison(instr);
    instr.push(binaryInstruction('and'));
  }
};

ParserState.prototype.parseComparison = function (instr) {
  this.parseAddSub(instr);
  while (this.accept(TOP, ['==', '!=', '<', '<=', '>=', '>'])) {
    var op = this.current;
    this.parseAddSub(instr);
    instr.push(binaryInstruction(op.value));
  }
};

ParserState.prototype.parseAddSub = function (instr) {
  this.parseTerm(instr);
  while (this.accept(TOP, ['+', '-', '||'])) {
    var op = this.current;
    this.parseTerm(instr);
    instr.push(binaryInstruction(op.value));
  }
};

ParserState.prototype.parseTerm = function (instr) {
  this.parseFactor(instr);
  while (this.accept(TOP, ['*', '/', '%'])) {
    var op = this.current;
    this.parseFactor(instr);
    instr.push(binaryInstruction(op.value));
  }
};

ParserState.prototype.parseFactor = function (instr) {
  var unaryOps = this.tokens.unaryOps;
  function isPrefixOperator(token) {
    return token.value in unaryOps;
  }

  this.save();
  if (this.accept(TOP, isPrefixOperator)) {
    if ((this.current.value !== '-' && this.current.value !== '+' && this.nextToken.type === TPAREN && this.nextToken.value === '(')) {
      this.restore();
      this.parseExponential(instr);
    } else {
      var op = this.current;
      this.parseFactor(instr);
      instr.push(unaryInstruction(op.value));
    }
  } else {
    this.parseExponential(instr);
  }
};

ParserState.prototype.parseExponential = function (instr) {
  this.parsePostfixExpression(instr);
  while (this.accept(TOP, '^')) {
    this.parseFactor(instr);
    instr.push(binaryInstruction('^'));
  }
};

ParserState.prototype.parsePostfixExpression = function (instr) {
  this.parseFunctionCall(instr);
  while (this.accept(TOP, '!')) {
    instr.push(unaryInstruction('!'));
  }
};

ParserState.prototype.parseFunctionCall = function (instr) {
  var unaryOps = this.tokens.unaryOps;
  function isPrefixOperator(token) {
    return token.value in unaryOps;
  }

  if (this.accept(TOP, isPrefixOperator)) {
    var op = this.current;
    this.parseAtom(instr);
    instr.push(unaryInstruction(op.value));
  } else {
    this.parseMemberExpression(instr);
    while (this.accept(TPAREN, '(')) {
      if (this.accept(TPAREN, ')')) {
        instr.push(new Instruction(IFUNCALL, 0));
      } else {
        var argCount = this.parseArgumentList(instr);
        instr.push(new Instruction(IFUNCALL, argCount));
      }
    }
  }
};

ParserState.prototype.parseArgumentList = function (instr) {
  var argCount = 0;

  while (!this.accept(TPAREN, ')')) {
    this.parseExpression(instr);
    ++argCount;
    while (this.accept(TCOMMA)) {
      this.parseExpression(instr);
      ++argCount;
    }
  }

  return argCount;
};

ParserState.prototype.parseMemberExpression = function (instr) {
  this.parseAtom(instr);
  while (this.accept(TOP, '.')) {
    this.expect(TNAME);
    instr.push(new Instruction(IMEMBER, this.current.value));
  }
};

function Parser() {
  this.unaryOps = {
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    asin: Math.asin,
    acos: Math.acos,
    atan: Math.atan,
    sinh: Math.sinh || sinh,
    cosh: Math.cosh || cosh,
    tanh: Math.tanh || tanh,
    asinh: Math.asinh || asinh,
    acosh: Math.acosh || acosh,
    atanh: Math.atanh || atanh,
    sqrt: Math.sqrt,
    log: Math.log,
    ln: Math.log,
    lg: Math.log10 || log10,
    log10: Math.log10 || log10,
    abs: Math.abs,
    ceil: Math.ceil,
    floor: Math.floor,
    round: Math.round,
    trunc: Math.trunc || trunc,
    '-': neg,
    '+': Number,
    exp: Math.exp,
    not: not,
    length: stringLength,
    '!': factorial
  };

  this.binaryOps = {
    '+': add,
    '-': sub,
    '*': mul,
    '/': div,
    '%': mod,
    '^': Math.pow,
    '||': concat,
    '==': equal,
    '!=': notEqual,
    '>': greaterThan,
    '<': lessThan,
    '>=': greaterThanEqual,
    '<=': lessThanEqual,
    and: andOperator,
    or: orOperator
  };

  this.ternaryOps = {
    '?': condition
  };

  this.functions = {
    random: random,
    fac: factorial,
    min: Math.min,
    max: Math.max,
    hypot: Math.hypot || hypot,
    pyt: Math.hypot || hypot, // backward compat
    pow: Math.pow,
    atan2: Math.atan2,
    'if': condition,
    gamma: gamma
  };

  this.consts = {
    E: Math.E,
    PI: Math.PI,
    'true': true,
    'false': false
  };
}

Parser.parse = function (expr) {
  return new Parser().parse(expr);
};

Parser.evaluate = function (expr, variables) {
  return Parser.parse(expr).evaluate(variables);
};

Parser.prototype = {
  parse: function (expr) {
    var instr = [];
    var parserState = new ParserState(this, new TokenStream(expr, this.unaryOps, this.binaryOps, this.ternaryOps, this.consts));
    parserState.parseExpression(instr);
    parserState.expect(TEOF, 'EOF');

    return new Expression(instr, this);
  },

  evaluate: function (expr, variables) {
    return this.parse(expr).evaluate(variables);
  }
};

var parser = {
  Parser: Parser,
  Expression: Expression
};

return parser;

})));


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
    // Hack to make all exports of this module sha256 function object properties.
    var exports = {};
    factory(exports);
    var sha256 = exports["default"];
    for (var k in exports) {
        sha256[k] = exports[k];
    }
        
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = sha256;
    } else if (true) {
        !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return sha256; }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); 
    } else {
        root.sha256 = sha256;
    }
})(this, function(exports) {
"use strict";
// SHA-256 (+ HMAC and PBKDF2) for JavaScript.
//
// Written in 2014-2016 by Dmitry Chestnykh.
// Public domain, no warranty.
//
// Functions (accept and return Uint8Arrays):
//
//   sha256(message) -> hash
//   sha256.hmac(key, message) -> mac
//   sha256.pbkdf2(password, salt, rounds, dkLen) -> dk
//
//  Classes:
//
//   new sha256.Hash()
//   new sha256.HMAC(key)
//
exports.digestLength = 32;
exports.blockSize = 64;
// SHA-256 constants
var K = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b,
    0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01,
    0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7,
    0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
    0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152,
    0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
    0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc,
    0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819,
    0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08,
    0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f,
    0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
]);
function hashBlocks(w, v, p, pos, len) {
    var a, b, c, d, e, f, g, h, u, i, j, t1, t2;
    while (len >= 64) {
        a = v[0];
        b = v[1];
        c = v[2];
        d = v[3];
        e = v[4];
        f = v[5];
        g = v[6];
        h = v[7];
        for (i = 0; i < 16; i++) {
            j = pos + i * 4;
            w[i] = (((p[j] & 0xff) << 24) | ((p[j + 1] & 0xff) << 16) |
                ((p[j + 2] & 0xff) << 8) | (p[j + 3] & 0xff));
        }
        for (i = 16; i < 64; i++) {
            u = w[i - 2];
            t1 = (u >>> 17 | u << (32 - 17)) ^ (u >>> 19 | u << (32 - 19)) ^ (u >>> 10);
            u = w[i - 15];
            t2 = (u >>> 7 | u << (32 - 7)) ^ (u >>> 18 | u << (32 - 18)) ^ (u >>> 3);
            w[i] = (t1 + w[i - 7] | 0) + (t2 + w[i - 16] | 0);
        }
        for (i = 0; i < 64; i++) {
            t1 = (((((e >>> 6 | e << (32 - 6)) ^ (e >>> 11 | e << (32 - 11)) ^
                (e >>> 25 | e << (32 - 25))) + ((e & f) ^ (~e & g))) | 0) +
                ((h + ((K[i] + w[i]) | 0)) | 0)) | 0;
            t2 = (((a >>> 2 | a << (32 - 2)) ^ (a >>> 13 | a << (32 - 13)) ^
                (a >>> 22 | a << (32 - 22))) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
            h = g;
            g = f;
            f = e;
            e = (d + t1) | 0;
            d = c;
            c = b;
            b = a;
            a = (t1 + t2) | 0;
        }
        v[0] += a;
        v[1] += b;
        v[2] += c;
        v[3] += d;
        v[4] += e;
        v[5] += f;
        v[6] += g;
        v[7] += h;
        pos += 64;
        len -= 64;
    }
    return pos;
}
// Hash implements SHA256 hash algorithm.
var Hash = (function () {
    function Hash() {
        this.digestLength = exports.digestLength;
        this.blockSize = exports.blockSize;
        // Note: Int32Array is used instead of Uint32Array for performance reasons.
        this.state = new Int32Array(8); // hash state
        this.temp = new Int32Array(64); // temporary state
        this.buffer = new Uint8Array(128); // buffer for data to hash
        this.bufferLength = 0; // number of bytes in buffer
        this.bytesHashed = 0; // number of total bytes hashed
        this.finished = false; // indicates whether the hash was finalized
        this.reset();
    }
    // Resets hash state making it possible
    // to re-use this instance to hash other data.
    Hash.prototype.reset = function () {
        this.state[0] = 0x6a09e667;
        this.state[1] = 0xbb67ae85;
        this.state[2] = 0x3c6ef372;
        this.state[3] = 0xa54ff53a;
        this.state[4] = 0x510e527f;
        this.state[5] = 0x9b05688c;
        this.state[6] = 0x1f83d9ab;
        this.state[7] = 0x5be0cd19;
        this.bufferLength = 0;
        this.bytesHashed = 0;
        this.finished = false;
        return this;
    };
    // Cleans internal buffers and re-initializes hash state.
    Hash.prototype.clean = function () {
        for (var i = 0; i < this.buffer.length; i++)
            this.buffer[i] = 0;
        for (var i = 0; i < this.temp.length; i++)
            this.temp[i] = 0;
        this.reset();
    };
    // Updates hash state with the given data.
    //
    // Optionally, length of the data can be specified to hash
    // fewer bytes than data.length.
    //
    // Throws error when trying to update already finalized hash:
    // instance must be reset to use it again.
    Hash.prototype.update = function (data, dataLength) {
        if (dataLength === void 0) { dataLength = data.length; }
        if (this.finished) {
            throw new Error("SHA256: can't update because hash was finished.");
        }
        var dataPos = 0;
        this.bytesHashed += dataLength;
        if (this.bufferLength > 0) {
            while (this.bufferLength < 64 && dataLength > 0) {
                this.buffer[this.bufferLength++] = data[dataPos++];
                dataLength--;
            }
            if (this.bufferLength === 64) {
                hashBlocks(this.temp, this.state, this.buffer, 0, 64);
                this.bufferLength = 0;
            }
        }
        if (dataLength >= 64) {
            dataPos = hashBlocks(this.temp, this.state, data, dataPos, dataLength);
            dataLength %= 64;
        }
        while (dataLength > 0) {
            this.buffer[this.bufferLength++] = data[dataPos++];
            dataLength--;
        }
        return this;
    };
    // Finalizes hash state and puts hash into out.
    //
    // If hash was already finalized, puts the same value.
    Hash.prototype.finish = function (out) {
        if (!this.finished) {
            var bytesHashed = this.bytesHashed;
            var left = this.bufferLength;
            var bitLenHi = (bytesHashed / 0x20000000) | 0;
            var bitLenLo = bytesHashed << 3;
            var padLength = (bytesHashed % 64 < 56) ? 64 : 128;
            this.buffer[left] = 0x80;
            for (var i = left + 1; i < padLength - 8; i++) {
                this.buffer[i] = 0;
            }
            this.buffer[padLength - 8] = (bitLenHi >>> 24) & 0xff;
            this.buffer[padLength - 7] = (bitLenHi >>> 16) & 0xff;
            this.buffer[padLength - 6] = (bitLenHi >>> 8) & 0xff;
            this.buffer[padLength - 5] = (bitLenHi >>> 0) & 0xff;
            this.buffer[padLength - 4] = (bitLenLo >>> 24) & 0xff;
            this.buffer[padLength - 3] = (bitLenLo >>> 16) & 0xff;
            this.buffer[padLength - 2] = (bitLenLo >>> 8) & 0xff;
            this.buffer[padLength - 1] = (bitLenLo >>> 0) & 0xff;
            hashBlocks(this.temp, this.state, this.buffer, 0, padLength);
            this.finished = true;
        }
        for (var i = 0; i < 8; i++) {
            out[i * 4 + 0] = (this.state[i] >>> 24) & 0xff;
            out[i * 4 + 1] = (this.state[i] >>> 16) & 0xff;
            out[i * 4 + 2] = (this.state[i] >>> 8) & 0xff;
            out[i * 4 + 3] = (this.state[i] >>> 0) & 0xff;
        }
        return this;
    };
    // Returns the final hash digest.
    Hash.prototype.digest = function () {
        var out = new Uint8Array(this.digestLength);
        this.finish(out);
        return out;
    };
    // Internal function for use in HMAC for optimization.
    Hash.prototype._saveState = function (out) {
        for (var i = 0; i < this.state.length; i++) {
            out[i] = this.state[i];
        }
    };
    // Internal function for use in HMAC for optimization.
    Hash.prototype._restoreState = function (from, bytesHashed) {
        for (var i = 0; i < this.state.length; i++) {
            this.state[i] = from[i];
        }
        this.bytesHashed = bytesHashed;
        this.finished = false;
        this.bufferLength = 0;
    };
    return Hash;
}());
exports.Hash = Hash;
// HMAC implements HMAC-SHA256 message authentication algorithm.
var HMAC = (function () {
    function HMAC(key) {
        this.inner = new Hash();
        this.outer = new Hash();
        this.blockSize = this.inner.blockSize;
        this.digestLength = this.inner.digestLength;
        var pad = new Uint8Array(this.blockSize);
        if (key.length > this.blockSize) {
            (new Hash()).update(key).finish(pad).clean();
        }
        else {
            for (var i = 0; i < key.length; i++) {
                pad[i] = key[i];
            }
        }
        for (var i = 0; i < pad.length; i++) {
            pad[i] ^= 0x36;
        }
        this.inner.update(pad);
        for (var i = 0; i < pad.length; i++) {
            pad[i] ^= 0x36 ^ 0x5c;
        }
        this.outer.update(pad);
        this.istate = new Uint32Array(this.digestLength / 4);
        this.ostate = new Uint32Array(this.digestLength / 4);
        this.inner._saveState(this.istate);
        this.outer._saveState(this.ostate);
        for (var i = 0; i < pad.length; i++) {
            pad[i] = 0;
        }
    }
    // Returns HMAC state to the state initialized with key
    // to make it possible to run HMAC over the other data with the same
    // key without creating a new instance.
    HMAC.prototype.reset = function () {
        this.inner._restoreState(this.istate, this.inner.blockSize);
        this.outer._restoreState(this.ostate, this.outer.blockSize);
        return this;
    };
    // Cleans HMAC state.
    HMAC.prototype.clean = function () {
        for (var i = 0; i < this.istate.length; i++) {
            this.ostate[i] = this.istate[i] = 0;
        }
        this.inner.clean();
        this.outer.clean();
    };
    // Updates state with provided data.
    HMAC.prototype.update = function (data) {
        this.inner.update(data);
        return this;
    };
    // Finalizes HMAC and puts the result in out.
    HMAC.prototype.finish = function (out) {
        if (this.outer.finished) {
            this.outer.finish(out);
        }
        else {
            this.inner.finish(out);
            this.outer.update(out, this.digestLength).finish(out);
        }
        return this;
    };
    // Returns message authentication code.
    HMAC.prototype.digest = function () {
        var out = new Uint8Array(this.digestLength);
        this.finish(out);
        return out;
    };
    return HMAC;
}());
exports.HMAC = HMAC;
// Returns SHA256 hash of data.
function hash(data) {
    var h = (new Hash()).update(data);
    var digest = h.digest();
    h.clean();
    return digest;
}
exports.hash = hash;
exports.__esModule = true;
exports["default"] = hash;
// Returns HMAC-SHA256 of data under the key.
function hmac(key, data) {
    var h = (new HMAC(key)).update(data);
    var digest = h.digest();
    h.clean();
    return digest;
}
exports.hmac = hmac;
// Derives a key from password and salt using PBKDF2-HMAC-SHA256
// with the given number of iterations.
//
// The number of bytes returned is equal to dkLen.
//
// (For better security, avoid dkLen greater than hash length - 32 bytes).
function pbkdf2(password, salt, iterations, dkLen) {
    var prf = new HMAC(password);
    var len = prf.digestLength;
    var ctr = new Uint8Array(4);
    var t = new Uint8Array(len);
    var u = new Uint8Array(len);
    var dk = new Uint8Array(dkLen);
    for (var i = 0; i * len < dkLen; i++) {
        var c = i + 1;
        ctr[0] = (c >>> 24) & 0xff;
        ctr[1] = (c >>> 16) & 0xff;
        ctr[2] = (c >>> 8) & 0xff;
        ctr[3] = (c >>> 0) & 0xff;
        prf.reset();
        prf.update(salt);
        prf.update(ctr);
        prf.finish(u);
        for (var j = 0; j < len; j++) {
            t[j] = u[j];
        }
        for (var j = 2; j <= iterations; j++) {
            prf.reset();
            prf.update(u).finish(u);
            for (var k = 0; k < len; k++) {
                t[k] ^= u[k];
            }
        }
        for (var j = 0; j < len && i * len + j < dkLen; j++) {
            dk[i * len + j] = t[j];
        }
    }
    for (var i = 0; i < len; i++) {
        t[i] = u[i] = 0;
    }
    for (var i = 0; i < 4; i++) {
        ctr[i] = 0;
    }
    prf.clean();
    return dk;
}
exports.pbkdf2 = pbkdf2;
});


/***/ })
/******/ ]);