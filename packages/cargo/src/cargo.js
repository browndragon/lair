import asPackfile from './asPackfile';

/** A specific set of assets which are bundled together. */
export default class Cargo {
    constructor(name, assets) {
        this.name = name;
        this.assets = assets;
    }

    preloadScene(scene) {
        scene.load.addPack(asPackfile(this.name, this.assets));
    }

    assetTypes() {
        return Object.keys(this.assets);
    }
    assetsOfType(assetType) {
        // You have to interact with the phaser scene factories to actually *get* these objects ofc...
        return Object.keys(this.assets[assetType]);
    }
    asset(name) {
        return `${this.name}.${name}`;
    }

    /**
     * Turns a bunch of spritesheets with assumed-same row layout (so for instance: two rows named "right" and "left", or 4 rows named "ee"/"ss"/"ww"/"nn", etc; default 4 row) into the extracted animations.extracted
     *
     * Each key in animation descriptors names several output animations on this cargo as `${cargoName}.${key}.${rowName}`.
     */
    static animationRows(animationDescriptors, order=this.kOrder) {
        let rows = [];
        for (let i = 0; i < order.length; ++i) {
            const dir = order[i];
            for (let [k, v] of Object.entries(animationDescriptors)) {
                let start = 0, length = 0, key = k, imagekey = key;
                if (Number.isFinite(v)) {  // it's a single number, thus whole width of row.
                    length = v;
                    start = i * length;
                } else {
                    let width = v.width;
                    start = (v.start || 0) + width * i;
                    length = v.length || (width - v.start);
                    imagekey = v.key || key;
                }
                rows.push([`${key}.${dir}`, { frames:this.frames(imagekey, start, length) }]);
            }
        }
        return Object.fromEntries(rows);
    }
    static frames(key, start, length, isExact=false) {
        return Array.from({length}).map(
            isExact ?
            (_, j) => ({ fkey:key, frame:start + j}):
            (_, j) => ({ key:key, frame:start + j })
        );
    }
}

Cargo.kOrder = ['ee', 'ss', 'ww', 'nn'];
