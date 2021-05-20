import {typeFromObject} from './types';
import {setDataFromObject} from './setData';

// Creates the objects from the named tilemap object layer.
export default function createObjectsFromLayer(tilemap, layerName, getEntity) {
    const scene = tilemap.scene;
    let objectLayer = tilemap.getObjectLayer(layerName);
    let objects = [];
    for (let object of objectLayer.objects) {
        const type = typeFromObject(object, tilemap);
        let {x, y, width, height} = object;
        // WTF? And yet apparently, these are the coordinate systems in which we operate.
        console.assert(Number.isFinite(x += width / 2));
        console.assert(Number.isFinite(y -= height / 2));
        const Entity = getEntity(type);
        console.assert(Entity);
        const entity = new Entity(scene, x, y);
        setDataFromObject(entity, object, objectLayer, tilemap);
        scene.add.existing(entity);
        objects.push(entity);
    }
    return objects;
}