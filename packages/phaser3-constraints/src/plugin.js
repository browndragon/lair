// import Phaser from 'phaser';
import P3P from '@browndragon/phaser3-plugin';
import Anchor from './anchor';
import Cluster from './cluster';
import Corner from './corner';
import {Damp, Fixed, Force, Forces, Spring, Piecewise} from './force';
import Pair from './pair';

export default class Plugin extends P3P.Plugin {
    create(config) {
        for (let [key, innerConfig] of Object.entries(config)) {
            switch (key) {
                case 'pair':
                    return this.createPair(innerConfig);
                case 'cluster':
                    return this.createCluster(innerConfig);
                case 'corner':
                    return this.createCorner(innerConfig);
                default:
                    throw new TypeError();
            }
        }
        throw `unsupported ${config}`;
    }

    createPair({a, aOffset, b, bOffset, ...rest}) {
        const aMass = Anchor.ensure(a, aOffset);
        const bMass = Anchor.ensure(b, bOffset);
        if (rest.length == undefined) {
            rest.length = aMass.position.distance(bMass.position);
        }
        const force = this.createForce(rest);
        return new Pair(this, aMass, bMass, force);
    }
    createCluster({center, centerOffset, member, members, ...rest}) {
        const centerMass = Anchor.ensure(center, centerOffset);
        const force = this.createForce(rest);
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
    createCorner({center, centerOffset, ne, nw, se, sw, ...rest}) {
        const centerMass = Anchor.ensure(center, centerOffset);
        const force = this.createForce(rest);
        let corner = new Corner(this, centerMass, force);
        if (ne) { corner.ne = Anchor.ensure(ne) }
        if (se) { corner.se = Anchor.ensure(se) }
        if (sw) { corner.sw = Anchor.ensure(sw) }
        if (nw) { corner.nw = Anchor.ensure(nw) }
        return corner;
    }

    createForce(forceConfig) {
        if (forceConfig instanceof Force) {
            return forceConfig;
        }
        for (let [key, innerConfig] of Object.entries(forceConfig)) {
            switch (key) {
                case 'damp': return this.createDamp(innerConfig);
                case 'fixed': return this.createFixed(innerConfig);
                case 'forces': return this.createForces(innerConfig);
                case 'piecewise': return this.createPiecewise(innerConfig);
                case 'spring': return this.createSpring(innerConfig);
                default:
                    throw new TypeError(`Unrecognized ${forceConfig}`);
            }      
        }
        throw `unsupported ${forceConfig}`;
    }
    createDamp(damp) {
        return new Damp(damp);
    }
    createFixed(value) {
        return new Fixed(value);
    }
    createForces(forces) {
        if (!Array.isArray(forces)) {
            forces = [forces];
        }
        return new Forces(...forces.map(f => this.createForce(f)));
    }
    createFriction({length, to, fro, tan}) {
        return new Friction(length, tan, to, fro);
    }
    createSpring({length, stiffness}) {
        return new Spring(length, stiffness);
    }
    createPiecewise({div, before, after}) {
        return new Piecewise(
            div, this.createForce(before), this.createForce(after)
        );
    }    
}
