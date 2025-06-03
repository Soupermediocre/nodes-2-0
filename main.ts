namespace SpriteKind {
    export const Mouse = SpriteKind.create()
    export const Image = SpriteKind.create()
    export const NodeKind = SpriteKind.create()
    export const TempSprite = SpriteKind.create()
    export const Position = SpriteKind.create()
}
function PlaceNode (ConstrainDist: number, X: number, Y: number, Frozen: boolean) {
    Node = sprites.create(assets.image`Node`, SpriteKind.NodeKind)
    sprites.setDataNumber(Node, "Attached#", 1)
    Node.setPosition(X, Y)
    NodeList.push(Node)
    NodeList2 = spriteutils.getSpritesWithin(SpriteKind.NodeKind, ConstrainDist, Node)
    NodeList2.removeAt(NodeList2.indexOf(Node))
    for (let value of NodeList2) {
        LineImage.image.drawLine(Node.x, Node.y, value.x, value.y, 2)
        sprites.setDataSprite(value, "Attached:" + NodeList.indexOf(value) + "-" + NodeList.indexOf(Node), Node)
        sprites.setDataSprite(value, "SimpleAttached" + NodeList.indexOf(Node), Node)
        sprites.setDataSprite(Node, "Attached:" + NodeList.indexOf(Node) + "-" + NodeList.indexOf(value), value)
        sprites.setDataSprite(Node, "SimpleAttached" + NodeList.indexOf(value), value)
    }
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (NodesPlacementMode) {
        BridgePlacementMode = true
        NodesPlacementMode = false
    } else {
        BridgePlacementMode = false
        NodesPlacementMode = true
    }
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (NodesPlacementMode) {
        BridgePlacementMode = true
        NodesPlacementMode = false
    } else {
        BridgePlacementMode = false
        NodesPlacementMode = true
    }
})
browserEvents.onMouseMove(function (x, y) {
    Cursor.setPosition(x, y)
})
function DrawLinesImg () {
    LineImage.setImage(image.create(scene.screenWidth(), scene.screenHeight()))
    GUI.setImage(image.create(scene.screenWidth(), scene.screenHeight()))
    for (let value of spriteutils.getSpritesWithin(SpriteKind.NodeKind, ConstrainDistance, Cursor)) {
        Stress = Math.round(Math.abs(spriteutils.distanceBetween(Cursor, value) - ConstrainDistance))
        LineImage.image.drawLine(Cursor.x, Cursor.y, value.x, value.y, Math.constrain(Stress / 2, 2, 6))
    }
    LineImage.image.drawLine(0, 220, 320, 220, 14)
    GUI.image.drawTransparentImage(assets.image`NodesPlacingModeImg`, 10, 0)
    GUI.image.drawTransparentImage(assets.image`RoadsPlacingModeImg`, 30, 0)
    if (NodesPlacementMode) {
        GUI.image.drawTransparentImage(assets.image`myImage0`, 10, 0)
    } else {
        GUI.image.drawTransparentImage(assets.image`myImage0`, 30, 0)
    }
    images.print(GUI.image, "A", 3, 5, 1)
    images.print(GUI.image, "D", 48, 5, 1)
    images.print(GUI.image, "FPS: " + Fps, 60, 5, 1)
    for (let value of sprites.allOfKind(SpriteKind.NodeKind)) {
        for (let value2 of sprites.allOfKind(SpriteKind.NodeKind)) {
            if (sprites.readDataSprite(value, "Attached:" + NodeList.indexOf(value) + "-" + NodeList.indexOf(value2)) == value2 && value != value2) {
                Stress = Math.round(Math.abs(spriteutils.distanceBetween(value, value2) - ConstrainDistance))
                LineImage.image.drawLine(value.x, value.y, value2.x, value2.y, Math.constrain(Stress / 2, 2, 6))
                if (Math.constrain(Stress / 2, 2, 6) == 6) {
                    sprites.changeDataNumberBy(value, "Stress:" + NodeList.indexOf(value) + "-" + NodeList.indexOf(value2), 1)
                } else {
                    if (sprites.readDataNumber(value, "Stress:" + NodeList.indexOf(value) + "-" + NodeList.indexOf(value2)) > 0) {
                        sprites.changeDataNumberBy(value, "Stress:" + NodeList.indexOf(value) + "-" + NodeList.indexOf(value2), -1)
                    }
                }
                if (sprites.readDataNumber(value, "Stress:" + NodeList.indexOf(value) + "-" + NodeList.indexOf(value2)) >= 5) {
                    sprites.setDataSprite(value, "Attached:" + NodeList.indexOf(value) + "-" + NodeList.indexOf(value2), value)
                    sprites.setDataSprite(value2, "Attached:" + NodeList.indexOf(value2) + "-" + NodeList.indexOf(value), value2)
                    if (sprites.readDataNumber(value, "Attached#") == 1) {
                    	
                    }
                }
            }
        }
    }
}
browserEvents.MouseLeft.onEvent(browserEvents.MouseButtonEvent.Pressed, function (x, y) {
    if (NodesPlacementMode) {
        PlaceNode(ConstrainDistance, x, y, false)
    }
})
// temporary: destroys some connections between right clicked node
browserEvents.MouseRight.onEvent(browserEvents.MouseButtonEvent.Pressed, function (x, y) {
    for (let value of sprites.allOfKind(SpriteKind.NodeKind)) {
        if (spriteutils.distanceBetween(spriteutils.pos(x, y), value) < 5) {
            sprites.destroy(value)
        }
    }
})
let NodeSimilarityList: Sprite[] = []
let NodeSimilarity = 0
let FpsCounter = 0
let Distance = 0
let AttachedNodesNum = 0
let Fps = 0
let Stress = 0
let NodeList2: Sprite[] = []
let Node: Sprite = null
let NodeList: Sprite[] = []
let GUI: Sprite = null
let LineImage: Sprite = null
let Cursor: Sprite = null
let ConstrainDistance = 0
let NodesPlacementMode = false
let BridgePlacementMode = false
namespace userconfig {
    export const ARCADE_SCREEN_WIDTH = 320
    export const ARCADE_SCREEN_HEIGHT = 240
}
BridgePlacementMode = false
NodesPlacementMode = true
ConstrainDistance = 35
let Elasticity = 2
let DistanceEasing = 1.5
Cursor = sprites.create(image.create(ConstrainDistance * 2 + 1, ConstrainDistance * 2 + 1), SpriteKind.Mouse)
LineImage = sprites.create(image.create(scene.screenWidth(), scene.screenHeight()), SpriteKind.Image)
GUI = sprites.create(image.create(scene.screenWidth(), scene.screenHeight()), SpriteKind.Image)
LineImage.image.drawLine(0, 220, 320, 220, 6)
spriteutils.fillCircle(
Cursor.image,
ConstrainDistance,
ConstrainDistance,
3,
1
)
spriteutils.drawCircle(
Cursor.image,
ConstrainDistance,
ConstrainDistance,
ConstrainDistance,
1
)
NodeList = []
let PositionFinder = sprites.create(img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    `, SpriteKind.Position)
game.onUpdateInterval(25, function () {
    for (let value of sprites.allOfKind(SpriteKind.NodeKind)) {
        AttachedNodesNum = 1
        for (let value2 of sprites.allOfKind(SpriteKind.NodeKind)) {
            if (sprites.readDataSprite(value, "Attached:" + NodeList.indexOf(value) + "-" + NodeList.indexOf(value2)) == value2 && value != value2) {
                AttachedNodesNum += 1
            }
        }
        sprites.setDataNumber(value, "Attached#", AttachedNodesNum)
    }
    for (let value of sprites.allOfKind(SpriteKind.NodeKind)) {
        sprites.setDataNumber(value, "X", value.x)
        sprites.setDataNumber(value, "Y", value.y)
        for (let value2 of sprites.allOfKind(SpriteKind.NodeKind)) {
            if (sprites.readDataSprite(value, "Attached:" + NodeList.indexOf(value) + "-" + NodeList.indexOf(value2)) == value2 && value != value2) {
                Distance = (spriteutils.distanceBetween(value, value2) - ConstrainDistance) * Elasticity
                PositionFinder.setPosition(value.x, value.y)
                spriteutils.placeAngleFrom(
                PositionFinder,
                spriteutils.angleFrom(value, value2),
                Distance / DistanceEasing,
                value
                )
                sprites.changeDataNumberBy(value, "X", PositionFinder.x)
                sprites.changeDataNumberBy(value, "Y", PositionFinder.y)
            }
        }
        if (!(value.y >= 220)) {
            value.y = 0.5 + sprites.readDataNumber(value, "Y") / sprites.readDataNumber(value, "Attached#")
        } else {
            value.y = 220
        }
        value.x = sprites.readDataNumber(value, "X") / sprites.readDataNumber(value, "Attached#")
    }
    DrawLinesImg()
})
game.onUpdateInterval(1000, function () {
    Fps = FpsCounter
    FpsCounter = 0
})
forever(function () {
    FpsCounter += 1
})
// todo: merge nodes with the same connections data and similar locations
game.onUpdateInterval(100, function () {
    let PerformanceMode = 0
    if (PerformanceMode) {
        for (let value of sprites.allOfKind(SpriteKind.NodeKind)) {
            NodeSimilarity = 0
            NodeSimilarityList = spriteutils.getSpritesWithin(SpriteKind.NodeKind, 10, value)
            NodeSimilarityList.removeAt(NodeSimilarityList.indexOf(value))
            for (let value2 of NodeSimilarityList) {
                for (let value3 of sprites.allOfKind(SpriteKind.NodeKind)) {
                    if (value != value2 && sprites.readDataNumber(value, "Attached#") == sprites.readDataNumber(value2, "Attached#") && (sprites.readDataSprite(value, "Attached:" + NodeList.indexOf(value) + "-" + NodeList.indexOf(value3)) == value3 && sprites.readDataSprite(value2, "Attached:" + NodeList.indexOf(value2) + "-" + NodeList.indexOf(value3)) == value3)) {
                        NodeSimilarity += 1
                    }
                }
            }
            if (NodeSimilarity == sprites.readDataNumber(value, "Attached#") - 1 && sprites.readDataNumber(value, "Attached#") - 1 != 0) {
                for (let value2 of sprites.allOfKind(SpriteKind.NodeKind)) {
                    if (sprites.readDataSprite(value, "Attached:" + NodeList.indexOf(value) + "-" + NodeList.indexOf(value2)) == value2 && value != value2) {
                        sprites.setDataSprite(value2, "Attached:" + NodeList.indexOf(value2) + "-" + NodeList.indexOf(value), value2)
                    }
                }
                sprites.destroy(value)
            }
        }
    }
})
