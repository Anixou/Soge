function detectCollision(target, entitie) {
    // Vérification de la collision sur l'axe X
    const collisionX = target.x < entitie.width_co && target.width_co > entitie.x;

    // Vérification de la collision sur l'axe Y
    const collisionY = target.y < entitie.height_co && target.height_co > entitie.y;

    if (collisionX && collisionY) {
        // Déterminer le côté de la collision
        const overlapLeft = target.width_co - entitie.x;
        const overlapRight = entitie.width_co - target.x;
        const overlapTop = target.height_co - entitie.y;
        const overlapBottom = entitie.height_co - target.y;

        const smallestOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

        if (smallestOverlap === overlapLeft) return "left";
        if (smallestOverlap === overlapRight) return "right";
        if (smallestOverlap === overlapTop) return "top";
        if (smallestOverlap === overlapBottom) return "bottom";
    }

    return null; // Pas de collision
}

// Exemples d'utilisation
const target = {x: 10, y: 0, width_co: 60, height_co: 60};
const entitie = {x: 40, y: 0, width_co: 90, height_co: 90};

const collisionSide = detectCollision(target, entitie);
console.log(collisionSide); // Affichera "left", "right", "top", "bottom", ou null si pas de collision
