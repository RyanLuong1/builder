import { ComponentDefinition, ComponentType, AnyComponent, EntityDefinition } from './types'

/**
 * Generates a script where all GLTFShapes are instanced only once and can be refenced by their `src`
 */
export function writeGLTFComponents(components: Record<string, AnyComponent>): string {
  const gltfLookup: string[] = []
  let out = 'var gltfLookup = {\n'

  for (let key in components) {
    if (components[key].type === ComponentType.GLTFShape) {
      const component = components[key] as ComponentDefinition<ComponentType.GLTFShape>
      const { src } = component.data
      if (!gltfLookup.includes(src)) {
        gltfLookup.push(src)
        out += `\t'${src}': new GLTFShape('${src}'),\n`
      }
    }
  }

  out += `};
    for(var i in gltfLookup){
      gltfLookup[i].isPickable = true;
    }
  `

  return out
}

/**
 * Generates a script where all entities are instanced and reference their respective previously instanced components
 */
export function writeEntities(entities: Record<string, EntityDefinition>, components: Record<string, AnyComponent>): string {
  let out = `
    var entities = [];
    var currentEntity = null;
    var gizmoEvent = new OnDragEnded((e) => log('drag ended received in ECS', e));
    gizmoEvent.data.uuid = 'dragEndedEvent-editor';
  `

  for (let key in entities) {
    const entity = entities[key]

    out += `
      currentEntity = new Entity();
      entities.push(currentEntity);
      currentEntity.uuid = ${JSON.stringify(entity.id)};
      currentEntity.set(gizmoEvent);
    `

    for (let j = 0; j < entity.components.length; j++) {
      const component = components[entity.components[j]]
      if (component.type === ComponentType.GLTFShape) {
        const gltf = component as ComponentDefinition<ComponentType.GLTFShape>
        out += `currentEntity.set(gltfLookup['${gltf.data.src}']);\n`
      } else if (component.type === ComponentType.Transform) {
        const transform = component as ComponentDefinition<ComponentType.Transform>
        const { position, rotation } = transform.data
        out += `currentEntity.set(new Transform({
          position: new Vector3(${position.x}, ${position.y}, ${position.z}),
          rotation: new Quaternion(${rotation.x}, ${rotation.y}, ${rotation.z}, ${rotation.w})
        }));\n`
      }
    }

    out += `engine.addEntity(currentEntity);\n`
  }

  return out
}
