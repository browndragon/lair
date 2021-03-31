export default function asPackfile(somePrefix, someModule) {
    let files = [];
    let prefix = `${somePrefix}${somePrefix?'.':''}`;
    // { [someKey]:{ frameRate:24, frames:[{key:'someImageKey', frame:0}, { /*uses someKey*/, frame:1}, { /*someKey, 2*/}, ...] } }
    for (let [key, v] of Object.entries(someModule.animation || {})) {
        const animKey = `${prefix}${key}`;
        files.push({
            key:animKey,  // Key of the *file*. Basically discarded, since we don't *care*; we're only going to use the contents!
            type: 'animation',
            url: {
                type: 'frame',
                frameRate: 12,  // As a default...
                repeat: -1,  // As a default...

                ...v,

                key: animKey,  // Key of the *animation*
                frames: (v.frames || []).map((frame, i) => ({
                    // And then visit each *frame* and give it sane defaults (for instance, defaulting to same key as animation and/or same frame index as position!)
                    ...(frame || {}),
                    // fkey is a "foreign" or "full" key -- it doesn't assume it's local to this same resource.
                    // Otherwise an unqualified key is a local key to this cargo, which requires prefixing with the cargo's name.
                    key: frame.fkey || `${prefix}${frame.key || key}`,
                    frame: frame.frame != undefined ? frame.frame: i,
                })),
            },
        });
    }
    // { [someKey]:{ url:'someImageUrl.com', frameConfig: {frameHeight:16} } }
    for (let [key, v] of Object.entries(someModule.spritesheet || {})) {
        switch (typeof(v)) {
            case 'string': v = {url:v}; break;
        }
        files.push({
            type: 'spritesheet',

            ...v,

            // url: v.url,
            key: `${prefix}${key}`,
            frameConfig: { frameWidth: 32, frameHeight: 32, ...(v.frameConfig || {}) },
        });
    }
    // { [someKey]:{ url:'someImageUrl.com' } }
    for (let [key, v] of Object.entries(someModule.image || {})) {
        switch (typeof(v)) {
            case 'string': v = {url:v}; break;
        }
        files.push({
            type: 'image',

            ...v,

            // url: v.url,
            key: `${prefix}${key}`,
        });
    }
    // { [someKey]:{ url:['some.mp3', 'some.wav'] } }
    for (let [key, v] of Object.entries(someModule.audio || {})) {
        switch (typeof(v)) {
            case 'string': v = {url:v}; break;
            case 'object':
                // audio supports an array of audios for different browsers.
                if (Array.isArray(v)) {
                    v = {url:v}; break;
                }
        }
        files.push({
            type: 'audio',

            ...v,
            // url: v.url
            // config: v.config -- "An object containing an instances property for HTML5Audio. Defaults to 1."
            // I have no idea what sane defaults would be here.
            key: `${prefix}${key}`,
        });
    }
    // { [someKey]: { resources:['some.mp3', 'some.wav'], spritemap: {a:{start:0, end:1, loop:true} }}}
    for (let [key, v] of Object.entries(someModule.audioSprite || {})) {
        files.push({
            type: 'audioSprite',
            jsonFile: {
                ...v
            },
            key: `${prefix}${key}`,
        });
    }

    // TODO: support audio etc.

    // { [someKey]:{ textureURL, atlasURL, boneURL }}
    for (let [key, v] of Object.entries(someModule.dragonbone || {})) {
        files.push({
            type: 'dragonbone',

            ...v,

            key: `${prefix}${key}`,
            // textureURL: v.textureURL,
            // atlasURL: v.atlasURL,
            // boneURL: v.boneURL,
        });
    }

    return { [somePrefix]:{files} };
}
