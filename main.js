var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Cthulhu;
(function (Cthulhu) {
    var DiceType;
    (function (DiceType) {
        DiceType[DiceType["D6"] = 0] = "D6";
        DiceType[DiceType["D10"] = 1] = "D10";
        DiceType[DiceType["D100"] = 2] = "D100";
    })(DiceType = Cthulhu.DiceType || (Cthulhu.DiceType = {}));
    class Dice {
        constructor(type, face) {
            this.type = type;
            this.face = face;
        }
    }
    Cthulhu.Dice = Dice;
    var DiceGroup;
    (function (DiceGroup) {
        function clamp(value, min, max) {
            return Math.min(Math.max(value, min), max) | 0;
        }
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
        class D6 {
            constructor(max) {
                this._max = clamp(max, 1, 6);
                this._dice = new Dice(DiceType.D6, 1);
                this.value = 1;
            }
            get value() { return this._dice.face; }
            set value(value) { this._dice.face = clamp(value, 1, this.max); }
            get max() { return this._max; }
            get dices() { return [this._dice]; }
        }
        DiceGroup.D6 = D6;
        class D10 {
            constructor(max) {
                this._max = clamp(max, 1, 10);
                this._dice = new Dice(DiceType.D10, 0);
                this.value = this.max;
            }
            get value() { return (this._dice.face !== 0 ? this._dice.face : 10); }
            set value(value) { this._dice.face = clamp(value, 1, this.max) % 10; }
            get max() { return this._max; }
            get dices() { return [this._dice]; }
        }
        DiceGroup.D10 = D10;
        class D100 {
            constructor(max) {
                this._max = clamp(max, 1, 100);
                this._dices = [
                    new Dice(DiceType.D100, 0),
                    new Dice(DiceType.D10, 0),
                ];
                this.value = this.max;
            }
            get value() { return (x => x !== 0 ? x : 100)(this._dices[0].face * 10 + this._dices[1].face); }
            set value(value) { (x => { this._dices[0].face = (x / 10) | 0; this._dices[1].face = x % 10; })(clamp(value, 1, this._max) % 100); }
            get max() { return this._max; }
            get dices() { return this._dices; }
        }
        DiceGroup.D100 = D100;
    })(DiceGroup = Cthulhu.DiceGroup || (Cthulhu.DiceGroup = {}));
    class DiceSet {
        constructor(groups) {
            this.groups = groups;
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
    DiceSet.DICE_REGEX = /[1-9]\d*D[1-9]\d*/.compile();
    Cthulhu.DiceSet = DiceSet;
})(Cthulhu || (Cthulhu = {}));
var Cthulhu;
(function (Cthulhu) {
    var DiceRollEventType;
    (function (DiceRollEventType) {
        DiceRollEventType[DiceRollEventType["Start"] = 0] = "Start";
        DiceRollEventType[DiceRollEventType["Stop"] = 1] = "Stop";
        DiceRollEventType[DiceRollEventType["Update"] = 2] = "Update";
    })(DiceRollEventType = Cthulhu.DiceRollEventType || (Cthulhu.DiceRollEventType = {}));
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
        get diceSet() { return (this._current !== null ? this._diceSets[this._current] : null); }
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
            for (const group of diceSet.groups) {
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
    Cthulhu.DiceManager = DiceManager;
})(Cthulhu || (Cthulhu = {}));
/// <reference path="Dice.ts"/>
/// <reference path="DiceManager.ts"/>
var Cthulhu;
(function (Cthulhu) {
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
            return __awaiter(this, void 0, void 0, function* () {
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
            });
        }
        parseJson(json) {
            const slices = Object.create(null);
            slices[Cthulhu.DiceType.D6] = json[Cthulhu.DiceType[Cthulhu.DiceType.D6]];
            slices[Cthulhu.DiceType.D10] = json[Cthulhu.DiceType[Cthulhu.DiceType.D10]];
            slices[Cthulhu.DiceType.D100] = json[Cthulhu.DiceType[Cthulhu.DiceType.D100]];
            this._slices = slices;
        }
    }
    DiceImage.DATA_LAYOUT = 'layout';
    Cthulhu.DiceImage = DiceImage;
})(Cthulhu || (Cthulhu = {}));
var Cthulhu;
(function (Cthulhu) {
    var Result;
    (function (Result) {
        Result[Result["Normal"] = 0] = "Normal";
        Result[Result["Critical"] = 1] = "Critical";
        Result[Result["Fumble"] = 2] = "Fumble";
    })(Result || (Result = {}));
    class DiceNumberRenderer {
        constructor(view) {
            this.view = view;
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
            if (type === Cthulhu.DiceRollEventType.Update) {
                this.update(manager);
            }
        }
        onDiceSetChanged(manager) {
            this.update(manager);
        }
        update(manager) {
            const diceSet = manager.diceSet;
            if (diceSet) {
                const value = diceSet.groups.reduce((sum, group) => sum + group.value, 0);
                const text = value.toString(10);
                this.view.textContent = text;
                this.updateClass(diceSet, value);
            }
        }
        updateClass(diceSet, value) {
            const critical = this.view.dataset[DiceNumberRenderer.DATA_CRITICAL_CLASS];
            const fumble = this.view.dataset[DiceNumberRenderer.DATA_FUMBLE_CLASS];
            const classList = this.view.classList;
            const result = this.getResult(diceSet, value);
            if (critical) {
                if (result === Result.Critical) {
                    classList.add(critical);
                }
                else {
                    classList.remove(critical);
                }
            }
            if (fumble) {
                if (result === Result.Fumble) {
                    classList.add(fumble);
                }
                else {
                    classList.remove(fumble);
                }
            }
        }
        getResult(diceSet, value) {
            if (diceSet.groups.length === 1 && diceSet.groups[0].max === 100) {
                if (value <= 5)
                    return Result.Critical;
                if (value > 95)
                    return Result.Fumble;
            }
            return Result.Normal;
        }
    }
    DiceNumberRenderer.DATA_CRITICAL_CLASS = "criticalClass";
    DiceNumberRenderer.DATA_FUMBLE_CLASS = "fumbleClass";
    Cthulhu.DiceNumberRenderer = DiceNumberRenderer;
})(Cthulhu || (Cthulhu = {}));
/// <reference path="../model/__index__.ts"/>
/// <reference path="DiceImage.ts"/>
var Cthulhu;
(function (Cthulhu) {
    class DiceRenderer {
        constructor(container, image) {
            this.container = container;
            this.image = image;
            this._map = new Map();
        }
        clear() {
            this._map.clear();
            DiceRenderer.clearChild(this.container);
        }
        onAttached(manager) {
            this.initDices(manager);
        }
        onDetached(manager) {
            this.clear();
        }
        onRoll(manager, type) {
            if (type === Cthulhu.DiceRollEventType.Update) {
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
            const diceClass = this.container.dataset[DiceRenderer.DATA_DICE_CLASS];
            for (const group of diceSet.groups) {
                for (const dice of group.dices) {
                    const element = this.createDice(diceClass);
                    this._map.set(dice, element);
                }
            }
        }
        refresh(diceSet) {
            for (const group of diceSet.groups) {
                for (const dice of group.dices) {
                    const element = this._map.get(dice);
                    if (element != null) {
                        this.image.blit(element, dice.type, dice.face);
                    }
                }
            }
        }
        createDice(diceClass) {
            const dice = document.createElement('canvas');
            if (diceClass != null)
                dice.classList.add(diceClass);
            this.container.appendChild(dice);
            return dice;
        }
        static clearChild(element) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        }
    }
    DiceRenderer.DATA_DICE_CLASS = "diceClass";
    Cthulhu.DiceRenderer = DiceRenderer;
})(Cthulhu || (Cthulhu = {}));
var Cthulhu;
(function (Cthulhu) {
    var Page;
    (function (Page) {
        Page[Page["Home"] = 0] = "Home";
        Page[Page["Dice"] = 1] = "Dice";
        Page[Page["Status"] = 2] = "Status";
    })(Page = Cthulhu.Page || (Cthulhu.Page = {}));
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
        toPage(next) {
            for (const listener of this._listeners) {
                if (listener.onExit)
                    listener.onExit(this.page);
            }
            this._page = next;
            for (const listener of this._listeners) {
                if (listener.onEnter)
                    listener.onEnter(this.page);
            }
        }
    }
    Cthulhu.PageManager = PageManager;
})(Cthulhu || (Cthulhu = {}));
var Cthulhu;
(function (Cthulhu) {
    class ViewManager {
        constructor() { }
        static init() {
            document.addEventListener("DOMContentLoaded", () => {
                for (const callback of this._callbacks) {
                    callback();
                }
            });
        }
        static register(callback) {
            this._callbacks.push(callback);
        }
    }
    ViewManager._callbacks = [];
    Cthulhu.ViewManager = ViewManager;
    ViewManager.init();
})(Cthulhu || (Cthulhu = {}));
/// <reference path="DiceImage.ts"/>
/// <reference path="DiceNumberRenderer.ts"/>
/// <reference path="DiceRenderer.ts"/>
/// <reference path="PageManager.ts"/>
/// <reference path="ViewManager.ts"/>
/// <reference path="../model/__index__.ts"/>
/// <reference path="../view/__index__.ts"/>
var Cthulhu;
(function (Cthulhu) {
    const SELETED_CLASS = "selected";
    const manager = new Cthulhu.DiceManager();
    function initDiceSet() {
        const callbacks = [];
        manager.addListener(new class {
            onDiceSetChanged() {
                for (const callback of callbacks)
                    callback();
            }
        }());
        const modes = Array.from(document.querySelectorAll("#dice>.contents>.mode-list>.mode"));
        for (const mode of modes) {
            const id = mode.dataset["dice"];
            if (id != null) {
                if (id === 'custom') {
                    mode.addEventListener("click", () => { openCustomDiceDialog(); });
                }
                else {
                    manager.register(id, Cthulhu.DiceSet.parse(id));
                    mode.addEventListener("click", () => { manager.select(id); });
                }
                callbacks.push(() => {
                    if (manager.current === id) {
                        mode.classList.add(SELETED_CLASS);
                    }
                    else {
                        mode.classList.remove(SELETED_CLASS);
                    }
                });
            }
        }
    }
    function initRollButton() {
        const rollButton = document.querySelector("#dice>.contents>.roll-button");
        if (rollButton instanceof HTMLButtonElement) {
            rollButton.addEventListener("click", () => { manager.roll(); });
        }
    }
    function initRollSound() {
        const rollSound = document.querySelector("#dice>.contents>audio");
        if (rollSound instanceof HTMLAudioElement) {
            manager.addListener(new class {
                onRoll(manager, type) {
                    if (type === Cthulhu.DiceRollEventType.Start) {
                        rollSound.pause();
                        rollSound.currentTime = 0;
                        rollSound.play();
                    }
                }
            }());
        }
    }
    function initDiceView() {
        const diceView = document.querySelector("#dice>.contents>.result>.dice-view");
        const diceImage = document.getElementById("dice-image");
        if (diceView instanceof HTMLElement && diceImage instanceof HTMLImageElement) {
            const renderer = new Cthulhu.DiceRenderer(diceView, new Cthulhu.DiceImage(diceImage));
            manager.addListener(renderer);
        }
    }
    function initNumberView() {
        const numberView = document.querySelector("#dice>.contents>.result>.number-view");
        if (numberView instanceof HTMLElement) {
            const renderer = new Cthulhu.DiceNumberRenderer(numberView);
            manager.addListener(renderer);
        }
    }
    function initCustomDiceDialog() {
        const cancelButton = document.querySelector("#dice>.overlay>.custom-dice-dialog .cancel");
        const okButton = document.querySelector("#dice>.overlay>.custom-dice-dialog .ok");
        if (cancelButton instanceof HTMLButtonElement) {
            cancelButton.addEventListener("click", () => { closeCustomDiceDialog(true); });
        }
        if (okButton instanceof HTMLButtonElement) {
            okButton.addEventListener("click", () => { closeCustomDiceDialog(false); });
        }
    }
    function openCustomDiceDialog() {
        const dialog = document.querySelector("#dice>.overlay>.custom-dice-dialog");
        if (dialog instanceof HTMLElement) {
            dialog.classList.remove('hidden');
        }
        updateOverlay();
    }
    function closeCustomDiceDialog(cancel) {
        const dialog = document.querySelector("#dice>.overlay>.custom-dice-dialog");
        if (dialog instanceof HTMLElement) {
            dialog.classList.add('hidden');
            if (!cancel) {
                const countInput = document.querySelector("#dice>.overlay>.custom-dice-dialog .count");
                const maxInput = document.querySelector("#dice>.overlay>.custom-dice-dialog .max");
                if (countInput instanceof HTMLInputElement && maxInput instanceof HTMLInputElement) {
                    if (countInput.validity.valid && maxInput.validity.valid) {
                        const id = 'custom';
                        const count = parseInt(countInput.value, 10);
                        const max = parseInt(maxInput.value, 10);
                        const diceSet = Cthulhu.DiceSet.create(count, max);
                        manager.register(id, diceSet);
                        manager.select(id);
                    }
                }
            }
        }
        updateOverlay();
    }
    function updateOverlay() {
        const contents = document.querySelector("#dice>.contents");
        const overlay = document.querySelector("#dice>.overlay");
        if (contents instanceof HTMLElement && overlay instanceof HTMLElement) {
            const children = Array.from(overlay.children);
            if (children.some(dialog => !dialog.classList.contains('hidden'))) {
                contents.classList.add('disabled');
                overlay.classList.remove('disabled');
            }
            else {
                contents.classList.remove('disabled');
                overlay.classList.add('disabled');
            }
        }
    }
    Cthulhu.ViewManager.register(() => {
        initDiceSet();
        initRollButton();
        initRollSound();
        initDiceView();
        initNumberView();
        initCustomDiceDialog();
    });
})(Cthulhu || (Cthulhu = {}));
///<reference path="../view/__index__.ts"/>
var Cthulhu;
(function (Cthulhu) {
    const SELETED_CLASS = "selected";
    const manager = new Cthulhu.PageManager(Cthulhu.Page.Home);
    function handleSelectionEvent() {
        const elements = [
            [Cthulhu.Page.Home, document.getElementById("home")],
            [Cthulhu.Page.Dice, document.getElementById("dice")],
            [Cthulhu.Page.Status, document.getElementById("status")],
            [Cthulhu.Page.Dice, document.getElementById("menu-dice")],
            [Cthulhu.Page.Status, document.getElementById("menu-status")],
        ].filter(x => x[1] != null);
        manager.addListener(new class {
            onEnter(page) {
                for (const element of elements) {
                    if (element[0] === page) {
                        element[1].classList.add(SELETED_CLASS);
                    }
                }
            }
            onExit(page) {
                for (const element of elements) {
                    if (element[0] === page) {
                        element[1].classList.remove(SELETED_CLASS);
                    }
                }
            }
        });
    }
    function initNavigation() {
        const title = document.getElementById("title");
        const diceMenu = document.getElementById("menu-dice");
        const statusMenu = document.getElementById("menu-status");
        if (title)
            title.addEventListener("click", () => manager.toPage(Cthulhu.Page.Home));
        if (diceMenu)
            diceMenu.addEventListener("click", () => manager.toPage(Cthulhu.Page.Dice));
        if (statusMenu)
            statusMenu.addEventListener("click", () => manager.toPage(Cthulhu.Page.Status));
    }
    Cthulhu.ViewManager.register(() => {
        handleSelectionEvent();
        initNavigation();
    });
})(Cthulhu || (Cthulhu = {}));
