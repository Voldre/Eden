let loader = new THREE.ObjectLoader()
loader.load(
    'models/Head.json',
    function(object) {
        object.position.set(10, 0, 1)
        scene.add(object)
    }
)