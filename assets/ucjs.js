// import { html, Component, render } from 'https://unpkg.com/htm/preact/standalone.module.js';
import htm from "https://unpkg.com/htm?module";
import { html, render as rn } from "https://unpkg.com/htm/preact/standalone.module.js";

// ------------------------------------------------------
// Utils
// ------------------------------------------------------
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
}

function isObject(obj) {
    return obj !== null && typeof obj === "object";
}

// can we use __proto__?
var hasProto = "__proto__" in {};

function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true,
    });
}

// ------------------------------------------------------
// Array
// ------------------------------------------------------
const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);

/**
 * Intercept mutating methods and emit events
 */
["push", "pop", "shift", "unshift", "splice", "sort", "reverse"].forEach(function (method) {
    // cache original method
    const original = arrayProto[method];
    def(arrayMethods, method, function mutator() {
        // avoid leaking arguments:
        // http://jsperf.com/closure-with-arguments
        let i = arguments.length;
        const args = new Array(i);
        while (i--) {
            args[i] = arguments[i];
        }
        const result = original.apply(this, args);
        const ob = this.__ob__;
        let inserted;
        switch (method) {
            case "push":
                inserted = args;
                break;
            case "unshift":
                inserted = args;
                break;
            case "splice":
                inserted = args.slice(2);
                break;
        }
        if (inserted) ob.observeArray(inserted);
        // notify change
        ob.dep.notify();
        return result;
    });
});

function protoAugment(target, src) {
    /* eslint-disable no-proto */
    target.__proto__ = src;
    /* eslint-enable no-proto */
}

function copyAugment(target, src, keys) {
    for (let i = 0, l = keys.length; i < l; i++) {
        var key = keys[i];
        def(target, key, src[key]);
    }
}
// ------------------------------------------------------
// VDOM
// ------------------------------------------------------

// Mount a virtual node to the DOM
function mount(vnode, container) {
    // Create the element
    const el = (vnode.el = document.createElement(vnode.tag));

    // Set properties
    for (const key in vnode.props) {
        // If the property is an event handler (starts with "on") then add it as an event listener
        if (key.startsWith("on")) {
            el.addEventListener(key.slice(2).toLowerCase(), vnode.props[key]);
            // Otherwise, set it as an attribute
        } else el.setAttribute(key, vnode.props[key]);
    }

    // Handle children
    // Check if vnode.children is not ann array
    if (!Array.isArray(vnode.children)) {
        el.textContent = String(vnode.children);
    } else {
        vnode.children.forEach((child) => {
            mount(child, el);
        });
    }

    // Mount to the DOM
    container.appendChild(el);
}

// Unmount a virtual node from the DOM
function unmount(vnode) {
    vnode.el.parentNode.removeChild(vnode.el);
}

// Take 2 virtual nodes, compare & figure out what's the difference
function patch(n1, n2) {
    const el = (n2.el = n1.el);

    // Case where the nodes are of different tags
    if (n1.tag !== n2.tag) {
        mount(n2, el.parentNode);
        unmount(n1);
    }

    // Case where the nodes are of the same tag
    else {
        // New virtual node has string children
        if (!Array.isArray(n2.children)) {
            el.textContent = n2.children;
        }

        // New virtual node has array children
        else {
            // Old virtual node has string children
            if (!Array.isArray(n1.children)) {
                el.textContent = "";
                n2.children.forEach((child) => mount(child, el));
            }

            // Case where the new vnode has string children
            else {
                const c1 = n1.children;
                const c2 = n2.children;
                const commonLength = Math.min(c1.length, c2.length);

                // Patch the children both nodes have in common
                for (let i = 0; i < commonLength; i++) {
                    patch(c1[i], c2[i]);
                }

                // Old children was longer
                // Remove the children that are not "there" anymore
                if (c1.length > c2.length) {
                    c1.slice(c2.length).forEach((child) => {
                        unmount(child);
                    });
                }

                // Old children was shorter
                // Add the newly added children
                else if (c2.length > c1.length) {
                    c2.slice(c1.length).forEach((child) => {
                        mount(child, el);
                    });
                }
            }
        }
    }
}

let activeEffect;

class Dep {
    subscribers = new Set();
    depend() {
        if (activeEffect) this.subscribers.add(activeEffect);
    }
    notify() {
        this.subscribers.forEach((sub) => sub());
    }
}

function watchEffect(fn) {
    const wrappedFn = () => {
        activeEffect = wrappedFn;
        // clean up the deps
        fn();
        activeEffect = null;
    };

    wrappedFn();
}

// ------------------------------------------------------
// Observer
// ------------------------------------------------------
var arrayKeys = Object.getOwnPropertyNames(arrayMethods);
export function Observer(value) {
    this.value = value;
    this.dep = new Dep();
    //this.walk(value)
    if (Array.isArray(value)) {
        var augment = hasProto ? protoAugment : copyAugment;
        augment(value, arrayMethods, arrayKeys);
        this.observeArray(value);
    } else {
        this.walk(value);
    }
    def(value, "__ob__", this);
}

Observer.prototype.walk = function (obj) {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
        defineReactive(obj, keys[i], obj[keys[i]]);
    }
};

Observer.prototype.observeArray = function (items) {
    for (let i = 0, l = items.length; i < l; i++) {
        observe(items[i]);
    }
};

function addNewKey(obj, key, val) {
    defineReactive(obj, key, val);
}

function defineReactive(obj, key, val) {
    var dep = new Dep();
    var childOb = observe(val);
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            // console.log("get", key, val);
            let value = val;
            dep.depend();
            if (childOb) {
                childOb.dep.depend();
            }
            return value;
        },
        set: function reactiveSetter(newVal) {
            console.log("set", key, newVal);
            var value = val;
            if (newVal === value || (newVal !== newVal && value !== value)) {
                return;
            }
            val = newVal;
            childOb = observe(newVal);
            dep.notify();
        },
    });
    // Add new mthod setState to obj with this access
    obj.setState = (newState) => {
        for (let key in newState) {
            addNewKey(obj, key, newState[key]);
        }
    };    
    // listen to when new keys are added to the object
    // and add them as reactive properties
    
    return obj;
}

function observe(value) {
    if (!isObject(value)) {
        return;
    }
    var ob;
    if (hasOwn(value, "__ob__") && value.__ob__ instanceof Observer) {
        ob = value.__ob__;
    } else {
        ob = new Observer(value);
    }
    return ob;
}

// ------------------------------------------------------
// Style management
// ------------------------------------------------------

export const registerStyle = (key, style) => {
    // Check if there is any style tag with id equals to "ucjs-style".
    let style_tag = document.getElementById("ucjs-style" + key);
    if (!style_tag) {
        // If there is no style tag, create one.
        style_tag = document.createElement("style");
        style_tag.id = "ucjs-style" + key;
        style_tag.innerHTML = style;
        document.head.appendChild(style_tag);
    }
};


// ------------------------------------------------------
// Renderer
// ------------------------------------------------------

let RENDERER = 'preact_renderer';
export const default_renderer = function () {
    RENDERER = 'default_renderer';
    let previousVnode;
    watchEffect(() => {
        console.log("default_renderer rendering");
        if (!previousVnode) {
            previousVnode = this.$render(this.$state.value);
            mount(previousVnode, this.$el);
        } else {
            const newVnode = this.$render(this.$state.value);
            patch(previousVnode, newVnode);
            previousVnode = newVnode;
        }
    });
};

export const preact_renderer = function () {
    RENDERER = 'preact_renderer';
    let previousVnode;
    watchEffect(() => {
        console.log("preact_renderer rendering");
        if (!previousVnode) {
            previousVnode = this.$render(this.$state.value);
            rn(previousVnode, this.$el);
            previousVnode = this.$el.firstChild;
        } else {
            const newVnode = this.$render(this.$state.value);
            rn(newVnode, this.$el);
            previousVnode = this.$el.firstChild;
        }
    });
};


// ------------------------------------------------------
// Ucjs
// ------------------------------------------------------

export const Ucjs = function (app_el, app_cstor, state, renderer = preact_renderer) {
    this.$state = new Observer(state);
    // Create a getter for state
    this.state = new Proxy(this.$state, {
        get: (target, key) => {
            return target.value[key];
        },
        set: (target, key, value) => {
            target.value[key] = value;
            return true;
        },
    });
    this.$app = new app_cstor(this.state);
    this.$el = app_el;
    this.$render = this.$app.render;
    renderer.call(this);
    window.$app = this.$app;
    window.$state = this.$state;

};

function _h(type, props, ...children) {
    if (children.length === 1 && !isObject(children[0])) {
        children = children[0];
    }
    return { tag: type, type, props, children };
}

const _html = (...args) => {
    if (RENDERER == 'default_renderer'){
        return h_default(...args);
    }
    else if (RENDERER == 'preact_renderer'){
        return h_preact(...args);
    }
};

export const h_default = htm.bind(_h);
export const h_preact = html
export const h = _html
