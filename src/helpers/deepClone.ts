export function clone<T>(item: T): T {
    if (!item) {
        return item;
    } // null, undefined values check

    let types = [Number, String, Boolean];
    let result: any;

    // normalizing primitives if someone did new String('aaa'), or new Number('444');
    types.forEach(function (type) {
        if (item instanceof type) {
            result = type(item);
        }
    });

    if (typeof result == "undefined") {
        if (Object.prototype.toString.call(item) === "[object Array]" && Array.isArray(item)) {
            result = [];
            item.forEach((child, index) => {
                result[index] = clone(child);
            });
        } else if (typeof item == "object") {
            // testing that this is DOM
            if (item instanceof Node) {
                if (item.nodeType && typeof item.cloneNode == "function") {
                    result = item.cloneNode(true);
                }
            } else {
                // a code snippet has been changed !item.prototype -> !item.isPrototypeOf(Object)
                if (!item.isPrototypeOf(Object)) {
                    // check that this is a literal
                    if (item instanceof Date) {
                        result = new Date(item);
                    } else {
                        // it is an object literal
                        result = {};
                        for (let i in item) {
                            result[i] = clone(item[i]);
                        }
                    }
                } else {
                    result = item;
                }
            }
        } else {
            result = item;
        }
    }

    return result;
}
