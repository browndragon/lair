"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = asPackfile;

function asPackfile(somePrefix, someModule) {
  let files = [];
  let prefix = `${somePrefix}${somePrefix ? '.' : ''}`; // { [someKey]:{ frameRate:24, frames:[{key:'someImageKey', frame:0}, { /*uses someKey*/, frame:1}, { /*someKey, 2*/}, ...] } }

  for (let [key, v] of Object.entries(someModule.animation || {})) {
    const animKey = `${prefix}.${key}`;
    files.push({
      key: animKey,
      // Key of the *file*. Basically discarded, since we don't *care*; we're only going to use the contents!
      type: 'animation',
      url: {
        type: 'frame',
        frameRate: 12,
        // As a default...
        repeat: -1,
        // As a default...
        ...v,
        key: animKey,
        // Key of the *animation*
        frames: (v.frames || []).map((frame, i) => ({ // And then visit each *frame* and give it sane defaults (for instance, defaulting to same key as animation and/or same frame index as position!)
          ...(frame || {}),
          key: frame.key != undefined ? frame.key : key,
          frame: frame.frame != undefined ? frame.frame : i
        }))
      }
    });
  } // { [someKey]:{ url:'someImageUrl.com', frameConfig: {frameHeight:16} } }


  for (let [key, v] of Object.entries(someModule.spritesheet || {})) {
    switch (typeof v) {
      case 'string':
        v = {
          url: v
        };
        break;
    }

    files.push({
      type: 'spritesheet',
      ...v,
      // url: v.url,
      key: `${prefix}${key}`,
      frameConfig: {
        frameWidth: 32,
        frameHeight: 32,
        ...(v.frameConfig || {})
      }
    });
  } // { [someKey]:{ url:'someImageUrl.com' } }


  for (let [key, v] of Object.entries(someModule.image || {})) {
    switch (typeof v) {
      case 'string':
        v = {
          url: v
        };
        break;
    }

    files.push({
      type: 'image',
      ...v,
      // url: v.url,
      key: `${prefix}${key}`
    });
  } // TODO: support audio etc.
  // { [someKey]:{ textureURL, atlasURL, boneURL }}


  for (let [key, v] of Object.entries(someModule.dragonbone || {})) {
    files.push({
      type: 'dragonbone',
      ...v,
      key: `${prefix}${key}` // textureURL: v.textureURL,
      // atlasURL: v.atlasURL,
      // boneURL: v.boneURL,

    });
  }

  return {
    [somePrefix]: {
      files
    }
  };
}