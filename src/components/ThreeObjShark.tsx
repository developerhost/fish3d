import React from 'react'
import { useEffect } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const ThreeObjShark = () => {
  let canvas: HTMLElement
  useEffect(() => {
    if (canvas) return
    // canvasを取得
    canvas = document.getElementById('canvas')!

    // シーン
    const scene = new THREE.Scene()
    // scene.background = new THREE.Color(0x000000) // 背景色黒
    scene.background = new THREE.Color("white") // 背景色白

    //Bubble
    const geometry = new THREE.SphereGeometry(1,36,24);

    // const urls = [
    //   './img/bubble/posx.jpg','./img/bubble/negx.jpg',
    //   './img/bubble/posy.jpg','./img/bubble/negy.jpg',
    //   './img/bubble/posz.jpg','./img/bubble/negz.jpg',
    // ];

    const urls = ['/img/water.jpeg'];
   
    const textureCube = new THREE.CubeTextureLoader().load(urls);
    textureCube.format = THREE.RGBAFormat;
    // const shader = FresnelShader;
    // const uniforms = THREE.UniformsUtils.clone(shader.uniforms);
    const material = new THREE.MeshBasicMaterial({
      // color: 0x006788,
      opacity: 0.1,
      map: textureCube,
    });
    
    const sphere = new THREE.Mesh(geometry,material);
    scene.add(sphere);

    // サイズ
    // const sizes = {
    //   width: innerWidth,
    //   height: innerHeight
    // }

    // カメラ
    // const camera = new THREE.PerspectiveCamera(
    //   75,
    //   sizes.width / sizes.height,
    //   0.1,
    //   1000
    // )
    const camera = new THREE.PerspectiveCamera(90, 1000 / 1000, 1, 2000);
    camera.position.set(0, 0, 5)

    // レンダラー
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas || undefined,
      antialias: true,
      alpha: true
    })
    // renderer.setSize(sizes.width, sizes.height)
    // renderer.setPixelRatio(window.devicePixelRatio)

    // mouseでカメラの操作ができるようにする
    new OrbitControls(camera, renderer.domElement);

    // モデルの読み込み
    const loader = new GLTFLoader();

    // ボックスジオメトリー
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
    const boxMaterial = new THREE.MeshLambertMaterial({
      color: '#2497f0'
    })
    const box = new THREE.Mesh(boxGeometry, boxMaterial)
    box.position.z = -5
    box.rotation.set(10, 10, 10)
    scene.add(box)

    // ハンマーヘッドシャーク
    loader.load("/3d-model/model_great_hammerhead_shark/scene.gltf", function (gltf) {
      // sceneにmodelを追加
      scene.add(gltf.scene);

      // AnimationMixerを作成
      const mixer = new THREE.AnimationMixer(gltf.scene);

      // 全てのアニメーションを再生させる
      gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });

      scene.add(gltf.scene);

      const clock = new THREE.Clock();

      function animate() {
        // 次に実行されるときの時間差を保存
        const delta = clock.getDelta();
        // その時間差分のアニメーションをフレームを更新させる
        if (mixer) mixer.update(delta);
        // 毎回レンダリングをすることでアニメーション効果
        renderer.render(scene, camera);
        // 1秒に60回
        requestAnimationFrame(animate);
      }
      animate();
    })

    // 猫
    // loader.load("/3d-model/an_animated_cat/scene.gltf", function (gltf) {
    //   // sceneにmodelを追加
    //   scene.add(gltf.scene);
    // })

    // ボックスジオメトリー
    // const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
    // const boxMaterial = new THREE.MeshLambertMaterial({
    //   color: '#2497f0'
    // })
    // const box = new THREE.Mesh(boxGeometry, boxMaterial)
    // box.position.z = -5
    // box.rotation.set(10, 10, 10)
    // scene.add(box)

    // ライト
    const ambientLight = new THREE.AmbientLight(0xffffff, 4)
    scene.add(ambientLight)
    const pointLight = new THREE.PointLight(0xffffff, 0.2)
    pointLight.position.set(1, 2, 3)
    scene.add(pointLight)

    // アニメーション
    // const clock = new THREE.Clock()
    // const tick = () => {
    //   const elapsedTime = clock.getElapsedTime()
    //   // box.rotation.x = elapsedTime
    //   // box.rotation.y = elapsedTime
    //   window.requestAnimationFrame(tick)
    //   // renderer.outputEncoding = THREE.sRGBEncoding;
    //   renderer.shadowMap.enabled = true;
    //   renderer.render(scene, camera)
    // }
    // tick()

    // ブラウザのリサイズ処理
    // window.addEventListener('resize', () => {
    //   sizes.width = window.innerWidth
    //   sizes.height = window.innerHeight
    //   camera.aspect = sizes.width / sizes.height
    //   camera.updateProjectionMatrix()
    //   renderer.setSize(sizes.width, sizes.height)
    //   renderer.setPixelRatio(window.devicePixelRatio)
    // })
  }, [])
  return (
    <>
      <canvas id="canvas" width="1000" height="1000"></canvas>
    </>
  )
}

export default ThreeObjShark