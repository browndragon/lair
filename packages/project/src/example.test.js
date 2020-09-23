import { describe, test, expect } from '@jest/globals';
import project from '.';  // import project from '@browndragon/project';  <-- unit test, so I can't write that, but you can!

test('Example', () => {
    // A non-literal query returns the input if they're equivalent by `==`, or else undefined.
    expect(project('a', 'b')).toEqual(undefined);
    expect(project('a', 'a')).toEqual('a');
    expect(project(0, false)).toEqual(0);

    // An undefined or null query returns the input (exactly).
    expect(project(undefined, null)).toEqual(undefined);
    expect(project({}, null)).toEqual({});
    expect(project('', null)).toEqual('');
    expect(project({a:1}, null)).toEqual({a:1});
    expect(project({a:1, b:1}, null)).toEqual({a:1, b:1});
    expect(project({a:{b:1}}, null)).toEqual({a:{b:1}});

    // An empty object returns an empty object if the input is present.
    expect(project(undefined, {})).toEqual(undefined);
    expect(project(0, {})).toEqual({});
    expect(project('', {})).toEqual({});
    expect(project({}, {})).toEqual({});
    expect(project({a:1}, {})).toEqual({});
    expect(project({a:1, b:1}, {})).toEqual({});

    // Any non-empty object returns a new object literal with the subset of keys
    // whose recursive values matched:
    expect(project({}, {a:1})).toEqual({});
    expect(project({a:1}, {a:1})).toEqual({a:1});
    expect(project({a:1, b:1}, {a:1})).toEqual({a:1});
    // Since 1 != {b:1}, that match fails. Since that match fails, you don't record that a had a hit (since you expected it to be 1, not an object!).
    expect(project({a:{b:1}}, {a:1})).toEqual({});

    // And as you've seen, the definitions are recursive:
    expect(project({a:{b:{c:1, d:2}, e:3}, f:4}, {a:null})).toEqual({a:{b:{c:1, d:2}, e:3} /* no f, since you didn't ask for it! */});
    expect(project({a:{b:{c:1, d:2}, e:3}, f:4}, {a:{b:null}})).toEqual({a:{b:{c:1, d:2}}});
    expect(project({a:{b:{c:1, d:2}, e:3}, f:4}, {a:{b:{}}})).toEqual({a:{b:{}}});
    // Since b *isn't* 3, it won't match. But a did match an object (even if none of its keys), so you do get that back.
    expect(project({a:{b:{c:1, d:2}, e:3}, f:4}, {a:{b:3}})).toEqual({a:{}});
    expect(project({a:{b:{c:1, d:2}, e:3}, f:4}, {a:{e:3}})).toEqual({a:{e:3}});
    expect(project({a:{b:{c:1, d:2}, e:3}, f:4}, {a:{b:{c:null}}})).toEqual({a:{b:{c:1}}});
    expect(project({a:{b:{c:1, d:2}, e:3}, f:4}, {a:{b:{c:null, d:null}}})).toEqual({a:{b:{c:1, d:2}}});
    expect(project({a:{b:{c:1, d:2}, e:3}, f:4}, {a:{b:{c:null, d:2}}})).toEqual({a:{b:{c:1, d:2}}});
    expect(project({a:{b:{c:1, d:2}, e:3}, f:4}, {a:{b:{c:null, d:3}}})).toEqual({a:{b:{c:1}}});
});
