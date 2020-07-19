# jsBuddy
Provides `modelUpdate()` helper function to easily update an **ARRAY** or **OBJECT** without mutating the existing array/object and easily update deep nested objects without having to spread the objects at each level.

`npm i jsbuddy -S`

## modelUpdate
`modelUpdate(source, model, variables)`

**source** is the existing object

**model** is the object with changes you would like to make

**variables** is the object which contains any variables used in the **model**


Object Example: 
``` js
import {modelUpdate} from 'jsbuddy';
const source = {
    name: 'Sum User',
    age: 24,
    hobbies: {
        chess: true,
        sudoku: false,
        badminton: true
    }
};

const updatedSource = modelUpdate(source, {
    name: {
        $set: 'Some User'
    },
    hobbies: {
        $merge: {
            sudoku: true,
            cricket: true
        },
        $unset: ['badminton']
    }
});
```
Output:
``` js
{
    name: 'Some User',
    age: 24,
    hobbies: {
        chess: true,
        sudoku: true,
        cricket: true
    }
}
```

Array Example:
``` js
const source = [
    { id: 2 },
    { id: 3}
];

const updatedSource = modelUpdate(source, {
    $push: [
        { id: 4 },
        { id: 5 }
    ],
    // Don't have to use an array when there is only 1 item
    $unshift: { id: 1 },
    $remove: [1] // Removes 1st item {id: 2}
});
```
Output:
``` js
    [ { id: 1 }, { id: 3 }, { id: 4 }, { id: 5 } ]
```

### Array Operations
| Operation | Values (refer to examples)  | |
|----------|---| --- |
| $set | Any | Replaces current value with passed value in the model |
| $push | `[items]` or `item` | Adds the passed items or item to the end of an array |
| $unshift | same as $push | Adds the passed items or item to the beginning of an array   |
| $remove | `[array indices]`, `{key: value}`, `{key: function() { }}` function must return bool.  |Removes the items which |
| $splice | `[startIndex, endIndex, item1]` | Remove items and/or new items to array |

### Object Operations
| Operation | Values (refer to examples)  | |
|----------|---| --- |
| $set | Any | Replaces current value with passed value in the model |
| $unset | `[keys]` or `"key"` | Removes specified keys from the object |
| $merge | `{newKey: newValue}` | Add new properties to the existing object  |

### Examples
``` js

// General Example
const source = {
    store1: {
        products: [{
            id: 'p1'
        }]
    },
    store2: {
        products: [{
            id: 'p4'
        }]
    }
};

modelUpdate(source, {
    store1: {
        products: {
            $push: [{id: 'p2'}, {id: 'p3'}]
        }
    },
    store2: {
        products: {
            'p4': {
                $merge: {
                    name: 'Product 4'
                }
            }
        }
    }
});

// Example Array:
const source = [{ id: 1 }];

// $set examples
modelUpdate(source, {
    0: {
        $set: { id: 'one' }
    }
});

modelUpdate(source, {
    $1: {
        $set: { id: 'one' }
    }
}, {
    $1: function(item, index) {
        return index === 0;
    }
});

// $push or $unshift examples
modelUpdate(source, {
   $push: [{ id: 2 }]
   // or
   $push: { id: 3 }
});

// $remove
modelUpdate(source, {
    $remove: 0,
    // or 
    $remove: [0, 1],
    // or 
    $remove: {       // Removes item with matching object value
        id: 2
    },
    // or
    $remove: function(item, index) {  // Removes Array Item Matching object value
        retrun index === 0;
    },
    // or
    $remove: 'randomId123' // Remove array item object with key id / _id as randomId123
})

// $splice
modelUpdate(source, {
    $splice: [0, 10]    // Removes 10 items from 0
    // or
    $splice: [
        // Removes 1 item and adds 1 item
        [0, 1, {id: 3}], 
        // Removes nothing but adds 2 items
        [1, 0, {id: 4}, {id: 5}] 
    ]
})

// $merge
modelUpdate(source, {
    0: {
        $merge: {
            newId: 'SOME VALUE'
        }
    },
    // or
    '*': { // This will apply to all array items
        $merge: function(item, index) {
            return {
                newId: item.id * 10
            };
        }
    }
});

// $unset
modelUpdate(source, {
    '*': {
        $unset: 'id'
    }
    '*': {
        $unset: function(key, value) {
            return key === 'id';
        }
    }
});

```
