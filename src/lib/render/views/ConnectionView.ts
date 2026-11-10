import { Graphics } from "pixi.js";
import { BaseBody, BaseObject } from "@/lib/engine";

export class ConnectionView {
  public static draw(graphics: Graphics, objects: BaseObject[]){
    graphics.clear();

    const bodies = objects.filter((object): object is BaseBody => object instanceof BaseBody);
    const entities = bodies.flatMap((body) => body.entities);
    const entitiesById = new Map(entities.map((entity) => [entity.id, entity]));
    const drawnConnections = new Set<string>();

    for (const entity of entities) {
      for (const target of entity.connection.targets) {
        const connectedEntity = entitiesById.get(target.entityId);
        if (!connectedEntity) continue;

        const connectionId = JSON.stringify(
          [entity.id, connectedEntity.id].sort()
        );

        if (drawnConnections.has(connectionId)) continue;

        drawnConnections.add(connectionId);
        graphics.moveTo(entity.position.x, entity.position.y);
        graphics.lineTo(connectedEntity.position.x, connectedEntity.position.y);
      }
    }

    graphics.stroke({ width: 2, color: "black", alpha: 0.75 });
  }
}
