// import Phaser from 'phaser';
import P3P from '@browndragon/phaser3-plugin';
import Cluster from './cluster';
import Corner from './corner';
import {Compound, Damp, Fixed, Force, PointMass, Spring} from './force';
import Pair from './pair';

export default class Plugin extends P3P.Plugin {
    create(config) {
        switch (config.type) {
            case 'pair':
                return this.createPair(config);
            case 'cluster':
                return this.createCluster(config);
            case 'corner':
                return this.createCorner(config);
            default:
                throw new TypeError();
        }
        throw `unsupported ${config}`;
    }

    makePair({a, aOffset, b, bOffset, ...rest}) {
        const aMass = PointMass.ensure(a, aOffset);
        const bMass = PointMass.ensure(b, bOffset);
        if (rest.length == undefined) {
            rest.length = aMass.position.distance(bMass.position);
        }
        const force = this.makeForce(rest);
        return new Pair(this, aMass, bMass, force);
    }
    makeCluster({center, centerOffset, member, members, ...rest}) {
        const centerMass = PointMass.ensure(center, centerOffset);
        const force = this.makeForce(rest);
        let cluster = new Cluster(this, centerMass, force);
        if (member) {
            cluster.add({target:member});
        }
        if (members) {
            for (let member of members) {
                cluster.add({target:member});
            }
        }
        return cluster;
    }
    makeCorner({center, centerOffset, ne, nw, se, sw, ...rest}) {
        const centerMass = PointMass.ensure(center, centerOffset);
        const force = this.makeForce(rest);
        let corner = new Corner(this, centerMass, force);
        if (ne) { corner.ne = PointMass.ensure(ne) }
        if (se) { corner.se = PointMass.ensure(se) }
        if (sw) { corner.sw = PointMass.ensure(sw) }
        if (nw) { corner.nw = PointMass.ensure(nw) }
        return cluster;
    }

    makeForce(forceConfig) {
        if (forceConfig instanceof Force) {
            return forceConfig;
        }
        switch (forceConfig.type) {
            case 'compound': return this.makeCompound(forceConfig);
            case 'damp': return this.makeDamp(forceConfig);
            case 'fixed': return this.makeFixed(forceConfig);
            case 'spring': return this.makeSpring(forceConfig);
            default:
                throw new TypeError(`Unrecognized ${forceConfig}`);
        }
    }
    makeCompound({div, before, after}) {
        return new Compound(
            div, this.makeForce(before), this.makeForce(after)
        );
    }
    makeDamp({damp, force}) {
        return new Damp(damp, this.makeForce(force));
    }
    makeFixed({value}) {
        return new Fixed(value);
    }
    makeSpring({length, stiffness}) {
        return new Spring(length, stiffness);
    }
}
