namespace SpriteKind {
    export const Mouse = SpriteKind.create()
    export const Image = SpriteKind.create()
    export const NodeKind = SpriteKind.create()
    export const TempSprite = SpriteKind.create()
    export const Position = SpriteKind.create()
    export const RoadKind = SpriteKind.create()
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    PerformanceMode = !(PerformanceMode)
})
spriteutils.addEventHandler(spriteutils.UpdatePriorityModifier.After, spriteutils.UpdatePriority.Physics, function () {
    if (LineImage.image.getPixel(CollisionTesting.x, CollisionTesting.bottom) == 8) {
        CollisionTesting.y += CollisionPushBack * -1
    } else if (LineImage.image.getPixel(CollisionTesting.x, CollisionTesting.top) == 8) {
        CollisionTesting.y += CollisionPushBack * 1
    } else if (LineImage.image.getPixel(CollisionTesting.left, CollisionTesting.bottom) == 8) {
        CollisionTesting.y += CollisionPushBack * -1
        CollisionTesting.x += CollisionPushBack * 1
    } else if (LineImage.image.getPixel(CollisionTesting.left, CollisionTesting.top) == 8) {
        CollisionTesting.y += CollisionPushBack * 1
        CollisionTesting.x += CollisionPushBack * 1
    } else if (LineImage.image.getPixel(CollisionTesting.right, CollisionTesting.bottom) == 8) {
        CollisionTesting.y += CollisionPushBack * -1
        CollisionTesting.x += CollisionPushBack * -1
    } else if (LineImage.image.getPixel(CollisionTesting.right, CollisionTesting.top) == 8) {
        CollisionTesting.y += CollisionPushBack * 1
        CollisionTesting.x += CollisionPushBack * -1
    } else if (LineImage.image.getPixel(CollisionTesting.right, CollisionTesting.y) == 8) {
        CollisionTesting.x += CollisionPushBack * -1
    } else if (LineImage.image.getPixel(CollisionTesting.left, CollisionTesting.y) == 8) {
        CollisionTesting.x += CollisionPushBack * 1
    }
})
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
function NextRoadNode (Node: Sprite, _01: boolean) {
    RoadNodesList = spriteutils.getSpritesWithin(SpriteKind.RoadKind, 50, Node)
    RoadNodesList.removeAt(RoadNodesList.indexOf(Node))
    for (let value of RoadNodesList) {
        if (sprites.readDataNumber(Node, "RoadNum") != sprites.readDataNumber(value, "RoadNum")) {
            RoadNodesList.removeAt(RoadNodesList.indexOf(value))
        }
    }
    if (_01) {
        for (let value of RoadNodesList) {
            if (sprites.readDataNumber(Node, "RoadIndex") == sprites.readDataNumber(value, "RoadIndex") + 1) {
                return value
            }
        }
    } else {
        for (let value of RoadNodesList) {
            if (sprites.readDataNumber(Node, "RoadIndex") == sprites.readDataNumber(value, "RoadIndex") - 1) {
                return value
            }
        }
    }
    return Node
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (NodesPlacementMode) {
        BridgePlacementMode = true
        NodesPlacementMode = false
    } else {
        BridgePlacementMode = false
        NodesPlacementMode = true
    }
})
function PlaceRoad (x: number, y: number, Node: Sprite) {
    if (Bridge12 == 2) {
        Bridge12 = 1
        PositionFinder.setPosition(BridgeStart.x, BridgeStart.y)
        RoadIndex = -1
        for (let index = 0; index < Math.round(spriteutils.distanceBetween(BridgeStart, Node) / RoadNodesPer) - 1; index++) {
            RoadIndex += 1
            PlaceRoadNode(PositionFinder.x, PositionFinder.y, RoadIndex, RoadNum, BridgeStart, false)
            spriteutils.placeAngleFrom(
            PositionFinder,
            spriteutils.angleFrom(BridgeStart, Node),
            RoadNodesPer,
            PositionFinder
            )
        }
        RoadIndex += 1
        PlaceRoadNode(PositionFinder.x, PositionFinder.y, RoadIndex, RoadNum, Node, true)
        RoadNum += 1
    } else if (Bridge12 == 1) {
        Bridge12 = 2
        BridgeStart = Node
    }
}
browserEvents.onMouseMove(function (x, y) {
    Cursor.setPosition(x, y)
})
function DrawLinesImg () {
    LineImage.setImage(image.create(scene.screenWidth(), scene.screenHeight()))
    GUI.setImage(image.create(scene.screenWidth(), scene.screenHeight()))
    if (Bridge12 == 1 && (BridgePlacementMode && spriteutils.getSpritesWithin(SpriteKind.NodeKind, ConstrainDistance, Cursor).length > 0)) {
        LineImage.image.drawLine(Cursor.x, Cursor.y, spriteutils.getSpritesWithin(SpriteKind.NodeKind, ConstrainDistance, Cursor)[0].x, spriteutils.getSpritesWithin(SpriteKind.NodeKind, ConstrainDistance, Cursor)[0].y, 12)
    } else if (Bridge12 == 2 && (BridgePlacementMode && spriteutils.getSpritesWithin(SpriteKind.NodeKind, ConstrainDistance, Cursor).length > 0)) {
        LineImage.image.drawLine(BridgeStart.x, BridgeStart.y, Cursor.x, Cursor.y, 6)
        LineImage.image.drawLine(Cursor.x, Cursor.y, spriteutils.getSpritesWithin(SpriteKind.NodeKind, ConstrainDistance, Cursor)[0].x, spriteutils.getSpritesWithin(SpriteKind.NodeKind, ConstrainDistance, Cursor)[0].y, 12)
    } else {
        for (let value of spriteutils.getSpritesWithin(SpriteKind.NodeKind, ConstrainDistance, Cursor)) {
            LineImage.image.drawLine(Cursor.x, Cursor.y, value.x, value.y, 13)
        }
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
    images.print(GUI.image, "Nodes: " + sprites.allOfKind(SpriteKind.NodeKind).length, 110, 5, 1)
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
                    AttachedNodesNum = 1
                    for (let value3 of sprites.allOfKind(SpriteKind.NodeKind)) {
                        if (sprites.readDataSprite(value, "Attached:" + NodeList.indexOf(value) + "-" + NodeList.indexOf(value3)) == value3 && value != value3) {
                            AttachedNodesNum += 1
                        }
                    }
                    sprites.setDataNumber(value, "Attached#", AttachedNodesNum)
                    if (sprites.readDataNumber(value, "Attached#") == 1) {
                        sprites.destroy(value)
                    }
                }
            }
        }
    }
    for (let value of sprites.allOfKind(SpriteKind.RoadKind)) {
        for (let value2 of spriteutils.getSpritesWithin(SpriteKind.RoadKind, 50, value)) {
            if (sprites.readDataNumber(value, "RoadIndex") + 1 == sprites.readDataNumber(value2, "RoadIndex") && sprites.readDataNumber(value, "RoadNum") == sprites.readDataNumber(value2, "RoadNum")) {
                for (let index = 0; index <= 2; index++) {
                    LineImage.image.drawLine(value.x + index, value.y, value2.x + index, value2.y, 8)
                    LineImage.image.drawLine(value.x, value.y + index, value2.x, value2.y + index, 8)
                }
            }
        }
    }
}
function PlaceRoadNode (x: number, y: number, index: number, num: number, StickTo: Sprite, bool: boolean) {
    RoadNode = sprites.create(img`
        6 6 6 
        6 6 6 
        6 6 6 
        `, SpriteKind.RoadKind)
    RoadNode.setPosition(x, y)
    sprites.setDataNumber(RoadNode, "RoadIndex", index)
    sprites.setDataNumber(RoadNode, "RoadNum", num)
    sprites.setDataSprite(RoadNode, "StickTo", RoadNode)
    if (index == 0 || bool) {
        sprites.setDataSprite(RoadNode, "StickTo", StickTo)
        RoadNode.setImage(img`
            4 4 4 4 4 
            4 . 4 . 4 
            4 4 4 4 4 
            4 . 4 . 4 
            4 4 4 4 4 
            `)
    }
}
browserEvents.MouseLeft.onEvent(browserEvents.MouseButtonEvent.Pressed, function (x, y) {
    if (NodesPlacementMode) {
        PlaceNode(ConstrainDistance, x, y, false)
    } else {
        if (spriteutils.getSpritesWithin(SpriteKind.NodeKind, ConstrainDistance, Cursor).length > 0) {
            PlaceRoad(x, y, spriteutils.getSpritesWithin(SpriteKind.NodeKind, ConstrainDistance, Cursor)[0])
        }
    }
})
// temporary: destroys some connections between right clicked node
browserEvents.MouseRight.onEvent(browserEvents.MouseButtonEvent.Pressed, function (x, y) {
    if (NodesPlacementMode) {
        for (let value of sprites.allOfKind(SpriteKind.NodeKind)) {
            if (spriteutils.distanceBetween(spriteutils.pos(x, y), value) < 5) {
                sprites.destroy(value)
            }
        }
    } else {
        for (let value of sprites.allOfKind(SpriteKind.RoadKind)) {
            if (spriteutils.distanceBetween(spriteutils.pos(x, y), value) < 5) {
                value.sayText(sprites.readDataNumber(value, "RoadIndex"))
            }
        }
    }
})
let NodeSimilarityList: Sprite[] = []
let NodeSimilarity = 0
let FpsCounter = 0
let RoadForPhysics: Sprite = null
let Distance = 0
let RoadNode: Sprite = null
let AttachedNodesNum = 0
let Stress = 0
let Fps = 0
let RoadNum = 0
let RoadIndex = 0
let BridgeStart: Sprite = null
let RoadNodesList: Sprite[] = []
let NodeList2: Sprite[] = []
let Node: Sprite = null
let PerformanceMode = false
let PositionFinder: Sprite = null
let NodeList: Sprite[] = []
let CollisionTesting: Sprite = null
let GUI: Sprite = null
let LineImage: Sprite = null
let Cursor: Sprite = null
let CollisionPushBack = 0
let RoadNodesPer = 0
let ConstrainDistance = 0
let NodesPlacementMode = false
let BridgePlacementMode = false
let Bridge12 = 0
namespace userconfig {
    export const ARCADE_SCREEN_WIDTH = 320
    export const ARCADE_SCREEN_HEIGHT = 240
}
Bridge12 = 1
BridgePlacementMode = false
NodesPlacementMode = true
ConstrainDistance = 35
let Elasticity = 1.75
let DistanceEasing = 1.5
RoadNodesPer = 10
CollisionPushBack = 2.2
Cursor = sprites.create(image.create(ConstrainDistance * 2 + 1, ConstrainDistance * 2 + 1), SpriteKind.Mouse)
LineImage = sprites.create(image.create(scene.screenWidth(), scene.screenHeight()), SpriteKind.Image)
GUI = sprites.create(image.create(scene.screenWidth(), scene.screenHeight()), SpriteKind.Image)
LineImage.image.drawLine(0, 220, 320, 220, 6)
CollisionTesting = sprites.create(img`
    9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 
    9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 
    9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 
    9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 
    9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 
    9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 
    9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 
    9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 
    9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 
    9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 
    9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 
    9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 
    9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 
    9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 
    9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 
    9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 
    `, SpriteKind.Player)
controller.moveSprite(CollisionTesting)
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
PositionFinder = sprites.create(img`
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
    }
    for (let value of sprites.allOfKind(SpriteKind.RoadKind)) {
        sprites.setDataNumber(value, "X", value.x)
        sprites.setDataNumber(value, "Y", value.y)
        PositionFinder.setPosition(value.x, value.y)
        for (let index = 0; index <= 1; index++) {
            RoadForPhysics = NextRoadNode(value, index == 0)
            spriteutils.placeAngleFrom(
            PositionFinder,
            spriteutils.angleFrom(value, RoadForPhysics),
            (spriteutils.distanceBetween(value, RoadForPhysics) - RoadNodesPer) / 4 * 3,
            PositionFinder
            )
        }
        sprites.changeDataNumberBy(value, "X", PositionFinder.x)
        sprites.changeDataNumberBy(value, "Y", PositionFinder.y)
    }
    for (let value of sprites.allOfKind(SpriteKind.NodeKind)) {
        if (!(value.y >= 220)) {
            value.y = 0.5 + sprites.readDataNumber(value, "Y") / sprites.readDataNumber(value, "Attached#")
        } else {
            value.y = 220
        }
        value.x = sprites.readDataNumber(value, "X") / sprites.readDataNumber(value, "Attached#")
    }
    for (let value of sprites.allOfKind(SpriteKind.RoadKind)) {
        if (!(value.y >= 220)) {
            value.y = 0.25 + sprites.readDataNumber(value, "Y") / 2
        } else {
            value.y = 220
        }
        value.x = sprites.readDataNumber(value, "X") / 2
        if (sprites.readDataSprite(value, "StickTo") != value) {
            value.setPosition(sprites.readDataSprite(value, "StickTo").x, sprites.readDataSprite(value, "StickTo").y)
        }
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
    if (PerformanceMode) {
        for (let value of sprites.allOfKind(SpriteKind.NodeKind)) {
            NodeSimilarity = 0
            NodeSimilarityList = spriteutils.getSpritesWithin(SpriteKind.NodeKind, 5, value)
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
