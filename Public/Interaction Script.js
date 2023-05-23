//@input SceneObject StartButton
//@input SceneObject HitButton
//@input SceneObject CheckButton


script.HitButton.enabled = false;
script.CheckButton.enabled = false;

script.createEvent("TapEvent").bind(function(evt) {
    var startBoundingBox = script.StartButton.getComponent("Component.ScreenTransform");
    var hitBoundingBox = script.HitButton.getComponent("Component.ScreenTransform");
    var checkBoundingBox = script.CheckButton.getComponent("Component.ScreenTransform");
    var tap = evt.getTapPosition();
    if (script.StartButton.enabled && startBoundingBox.containsScreenPoint(tap)) {
        script.StartButton.enabled = false;
        
        script.HitButton.enabled = true;
        script.CheckButton.enabled = true;
        global.startGame();
    }
    if(script.HitButton.enabled && hitBoundingBox.containsScreenPoint(tap)){
        global.playerHitMe();
    } else if (script.CheckButton.enabled && checkBoundingBox.containsScreenPoint(tap)){
        script.CheckButton.enabled = false;
        global.playerCheck();
        
    }
})
