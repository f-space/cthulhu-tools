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
    class DiceSet {
        constructor(count, max) {
            this.count = count;
            this.max = max;
        }
        static create(expression) {
            if (!this.DICE_REGEX.test(expression))
                throw new Error("Invalid expression.");
            const [first, second] = expression.split("D");
            const count = parseInt(first, 10);
            const max = parseInt(second, 10);
            return new DiceSet(count, max);
        }
    }
    DiceSet.DICE_REGEX = /[1-9]\d*D[1-9]\d*/.compile();
    Cthulhu.DiceSet = DiceSet;
    class DiceManager {
        constructor() { }
        static get selection() { return this.current; }
        static register(id, diceSet) {
            this.diceSets.set(id, diceSet);
        }
        static unregister(id) {
            this.diceSets.delete(id);
        }
        static addListener(listener) {
            const index = this.listeners.indexOf(listener);
            if (index < 0)
                this.listeners.push(listener);
        }
        static removeListener(listener) {
            const index = this.listeners.indexOf(listener);
            if (index >= 0)
                this.listeners.splice(index, 1);
        }
        static select(id) {
            if (id !== this.current && !this.rolling) {
                const diceSet = this.diceSets.get(id);
                if (diceSet != null) {
                    this.current = id;
                    this.raiseEvent("onSelectionChanged", id, diceSet);
                    return true;
                }
            }
            return false;
        }
        static roll() {
            if (this.current != null && !this.rolling) {
                const diceSet = this.diceSets.get(this.current);
                if (diceSet != null) {
                    this.rollAsync(diceSet);
                    return true;
                }
            }
            return false;
        }
        static rollAsync(diceSet) {
            return __awaiter(this, void 0, void 0, function* () {
                this.rolling = true;
                this.raiseEvent("onStart");
                const endTime = Date.now() + this.duration;
                while (Date.now() < endTime) {
                    yield new Promise(resolve => setTimeout(resolve, this.interval));
                    if (this.current != null) {
                        const values = this.randomValues(diceSet);
                        this.raiseEvent("onUpdate", values);
                    }
                }
                const results = this.randomValues(diceSet);
                this.raiseEvent("onStop", results);
                this.rolling = false;
            });
        }
        static randomValues(diceSet) {
            const results = [];
            for (let i = 0; i < diceSet.count; i++) {
                results.push(Math.floor(Math.random() * diceSet.max) + 1);
            }
            return results;
        }
        static raiseEvent(event, ...args) {
            for (const listener of this.listeners) {
                const handler = listener[event];
                if (handler != null)
                    handler.apply(listener, args);
            }
        }
    }
    DiceManager.interval = 100;
    DiceManager.duration = 1000;
    DiceManager.current = null;
    DiceManager.rolling = false;
    DiceManager.diceSets = new Map();
    DiceManager.listeners = [];
    Cthulhu.DiceManager = DiceManager;
})(Cthulhu || (Cthulhu = {}));
var Cthulhu;
(function (Cthulhu) {
    class DiceRenderer {
        constructor(container) {
            this.container = container;
            this.clear();
        }
        clear() {
            this.groups = [];
            this.map = new Map();
            DiceRenderer.clearChild(this.container);
        }
        makeDices(diceSet) {
            this.clear();
            const diceClass = this.container.dataset[DiceRenderer.DATA_DICE_CLASS];
            if (diceClass != null) {
                const factory = DiceRenderer.getDiceGroupFactory(diceSet);
                for (let i = 0; i < diceSet.count; i++) {
                    const group = factory();
                    for (const dice of group.dices) {
                        const typeClass = DiceRenderer.getDiceTypeClass(dice.type);
                        const element = this.createDice(diceClass, typeClass);
                        this.map.set(dice, element);
                    }
                    this.groups.push(group);
                }
                this.refresh();
            }
        }
        setValues(values) {
            for (let i = 0; i < values.length; i++) {
                const group = this.groups[i];
                if (group != null) {
                    group.setValue(values[i]);
                }
            }
            this.refresh();
        }
        refresh() {
            for (const group of this.groups) {
                for (const dice of group.dices) {
                    const element = this.map.get(dice);
                    const data = String(dice.value);
                    if (element != null) {
                        element.dataset[DiceRenderer.DATA_DICE_VALUE] = data;
                    }
                }
            }
        }
        createDice(diceClass, typeClass) {
            const dice = document.createElement("div");
            dice.classList.add(diceClass);
            dice.classList.add(typeClass);
            this.container.appendChild(dice);
            return dice;
        }
        static getDiceGroupFactory(diceSet) {
            const max = diceSet.max;
            if (max > 100)
                return () => new DigitDiceGroup(diceSet.max);
            if (max > 10)
                return () => new D100D10DiceGroup();
            if (max > 6)
                return () => new D10DiceGroup();
            return () => new D6DiceGroup();
        }
        static getDiceTypeClass(type) {
            switch (type) {
                case 6: return this.CLASS_DICE_6;
                case 10: return this.CLASS_DICE_10;
                case 100: return this.CLASS_DICE_100;
            }
            throw new Error("Invalid dice type.");
        }
        static clearChild(element) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        }
    }
    DiceRenderer.DATA_DICE_CLASS = "diceClass";
    DiceRenderer.DATA_DICE_VALUE = "diceValue";
    DiceRenderer.CLASS_DICE_6 = "dice6";
    DiceRenderer.CLASS_DICE_10 = "dice10";
    DiceRenderer.CLASS_DICE_100 = "dice100";
    Cthulhu.DiceRenderer = DiceRenderer;
    class Dice {
        constructor(type) {
            this.type = type;
            this.value = 0;
        }
    }
    class DigitDiceGroup {
        constructor(max) {
            this.dices = [];
            for (let x = max; x > 0; x = Math.floor(x / 10)) {
                this.dices.push(new Dice(10));
            }
            this.setValue(max);
        }
        setValue(value) {
            for (let i = 0; i < this.dices.length; i++) {
                const n = value % 10;
                this.dices[this.dices.length - 1 - i].value = n;
                value -= n;
            }
        }
    }
    class D100D10DiceGroup {
        constructor() {
            this.dices = [];
            this.dices.push(new Dice(100));
            this.dices.push(new Dice(10));
            this.setValue(100);
        }
        setValue(value) {
            const rem = value % 10;
            this.dices[0].value = (value - rem) % 100;
            this.dices[1].value = rem;
        }
    }
    class D10DiceGroup {
        constructor() {
            this.dices = [];
            this.dices.push(new Dice(10));
            this.setValue(10);
        }
        setValue(value) {
            this.dices[0].value = value % 10;
        }
    }
    class D6DiceGroup {
        constructor() {
            this.dices = [];
            this.dices.push(new Dice(6));
            this.setValue(1);
        }
        setValue(value) {
            this.dices[0].value = value;
        }
    }
})(Cthulhu || (Cthulhu = {}));
var Cthulhu;
(function (Cthulhu) {
    function getElementById(id) {
        const element = document.getElementById(id);
        if (element == null)
            throw new Error(`${id} not found.`);
        return element;
    }
    document.addEventListener("DOMContentLoaded", function () {
        Cthulhu.PageManager.register(Cthulhu.Page.Home, getElementById("home"));
        Cthulhu.PageManager.register(Cthulhu.Page.Dice, getElementById("menu-dice"));
        Cthulhu.PageManager.register(Cthulhu.Page.Dice, getElementById("dice"));
        Cthulhu.PageManager.register(Cthulhu.Page.Status, getElementById("menu-status"));
        Cthulhu.PageManager.register(Cthulhu.Page.Status, getElementById("status"));
        getElementById("title").addEventListener("click", () => Cthulhu.PageManager.toHomePage());
        getElementById("menu-dice").addEventListener("click", () => Cthulhu.PageManager.toDicePage());
        getElementById("menu-status").addEventListener("click", () => Cthulhu.PageManager.toStatusPage());
        Cthulhu.PageManager.toHomePage();
        const modes = Array.from(document.querySelectorAll("#dice>.mode-list>.mode"));
        for (const mode of modes) {
            const diceExpr = mode.dataset["dice"];
            if (diceExpr != null) {
                const diceSet = Cthulhu.DiceSet.create(diceExpr);
                Cthulhu.DiceManager.register(diceExpr, diceSet);
                mode.addEventListener("click", () => { Cthulhu.DiceManager.select(diceExpr); });
            }
        }
        const rollButton = document.querySelector("#dice>.roll-button");
        const rollSound = document.querySelector("#dice>audio");
        if (rollButton instanceof HTMLButtonElement && rollSound instanceof HTMLAudioElement) {
            rollButton.addEventListener("click", () => {
                if (Cthulhu.DiceManager.roll()) {
                    rollSound.pause();
                    rollSound.currentTime = 0;
                    rollSound.play();
                }
            });
        }
        Cthulhu.DiceManager.addListener(new class {
            onSelectionChanged(id, diceSet) {
                for (const mode of modes) {
                    if (mode.dataset["dice"] === id) {
                        mode.classList.add("selected");
                    }
                    else {
                        mode.classList.remove("selected");
                    }
                }
            }
        });
        const diceView = document.querySelector("#dice>.result>.dice-view");
        if (diceView instanceof HTMLElement) {
            const renderer = new Cthulhu.DiceRenderer(diceView);
            Cthulhu.DiceManager.addListener(new class {
                onSelectionChanged(id, diceSet) {
                    renderer.makeDices(diceSet);
                }
                onStart() { }
                onUpdate(values) {
                    renderer.setValues(values);
                }
                onStop(results) {
                    renderer.setValues(results);
                }
            });
        }
        const numberView = document.querySelector("#dice>.result>.number-view");
        if (numberView instanceof HTMLElement) {
            Cthulhu.DiceManager.addListener(new class {
                onSelectionChanged(id, diceSet) {
                    numberView.textContent = null;
                }
                onUpdate(values) {
                    numberView.textContent = String(values.reduce((sum, x) => sum + x, 0));
                }
                onStop(results) {
                    numberView.textContent = String(results.reduce((sum, x) => sum + x, 0));
                }
            });
        }
    });
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
        constructor() { }
        static register(page, element) {
            let list = this.elements.get(page);
            if (list == null) {
                this.elements.set(page, list = []);
            }
            list.push(element);
        }
        static unregister(page, element) {
            const list = this.elements.get(page);
            if (list != null) {
                const index = list.indexOf(element);
                if (index >= 0)
                    list.splice(index, 1);
            }
        }
        static toPage(next) {
            const className = this.SELECTED_CLASS;
            for (const [page, elementList] of this.elements) {
                if (page === next) {
                    elementList.forEach(element => element.classList.add(className));
                }
                else {
                    elementList.forEach(element => element.classList.remove(className));
                }
            }
        }
        static toHomePage() {
            this.toPage(Page.Home);
        }
        static toDicePage() {
            this.toPage(Page.Dice);
        }
        static toStatusPage() {
            this.toPage(Page.Status);
        }
    }
    PageManager.SELECTED_CLASS = "selected";
    PageManager.elements = new Map();
    Cthulhu.PageManager = PageManager;
})(Cthulhu || (Cthulhu = {}));
