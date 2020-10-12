// import Phaser from 'phaser';
import P3P from '@browndragon/phaser3-plugin';
import Cluster from './cluster';
import Corner from './corner';
import {Damp, Limit, PointMass, Spring} from './force';
import Pair from './pair';

export default class Plugin extends P3P.Plugin {
    create(config) {
        switch (config.type) {
            case 'pair':
                return makePair(config);
            case 'cluster':
                return makeCluster(config);
            case 'corner':
                return makeCorner(config);
            default:
                throw new TypeError();
        }
        throw `unsupported ${config}`;
    }
}

function makePair({a, aOffset, b, bOffset, ...rest}) {
    const aMass = PointMass.ensure(a, aOffset);
    const bMass = PointMass.ensure(b, bOffset);
    if (rest.l == undefined) {
        rest.l = aMass.position.distance(bMass.position);
    }
    const force = makeForce(rest);
}

function makeCluster({center, centerOffset, member, members, ...rest}) {
    const centerMass = new PointMass(center, centerOffset);

}
