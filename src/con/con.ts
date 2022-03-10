import { Func } from '../core/func';
import { Canvas } from '../webgl/canvas';
import { Object3D } from 'three/src/core/Object3D';
import { Conf } from '../core/conf';
import { Color } from "three/src/math/Color";
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry";
import { EdgesGeometry } from "three/src/geometries/EdgesGeometry";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { LineBasicMaterial } from "three/src/materials/LineBasicMaterial";
import { Mesh } from 'three/src/objects/Mesh';
import { LineSegments } from 'three/src/objects/LineSegments';
import { Mouse } from '../core/mouse';
import { Util } from '../libs/util';

export class Con extends Canvas {

  private _con: Object3D;
  private _bg:Array<Mesh> = []
  private _line:Array<LineSegments> = []

  // コンソール結果を一時的に入れておく
  private _temp:Array<any> = []

  constructor(opt: any) {
    super(opt);

    this._con = new Object3D()
    this.mainScene.add(this._con)

    // 共通ジオメトリ
    const geo1 = new PlaneGeometry(1,1)
    const geo2 = new EdgesGeometry(geo1)

    // アイテム作成
    const num = 40
    for(let i = 0; i < num; i++) {
      const bg = new Mesh(
        geo1,
        new MeshBasicMaterial({
          color:0xff0000,
          transparent:true
        })
      )
      const line = new LineSegments(
        geo2,
        new LineBasicMaterial({
          color:0xff0000,
          transparent:true
        })
      )

      this._con.add(bg)
      this._con.add(line)

      this._bg.push(bg)
      this._line.push(line)
    }

    //console.log('%cSKETCH.181', 'border:5px solid #0000FF;border-radius:0px;padding:20px;color:#FFF;font-size:30px;')

    this._resize()
  }


  protected _update(): void {
    super._update()
    this._con.position.y = Func.instance.screenOffsetY() * -1

    // コンソール出力
    let mx = (Mouse.instance.easeNormal.x + 1) * 0.5
    // let my = (Mouse.instance.easeNormal.y + 1) * 0.5

    const fontSize = Util.instance.map(mx, 10, 600, 0, 1)
    const h = ~~(mx * 360)
    const col = new Color('hsl(' + h + ', 100%, 50%)')
    const col2 = new Color(1 - col.r, 1 - col.g, 1 - col.b)

    // console.log('%c_______________________________________________________________________', 'background-color:#' + col.getHexString())
    // console.log('%cSKETCH.181', 'font-size:' + fontSize + 'px;font-weight:bold;color:#' + col.getHexString())
    console.log('%c.', 'background-color:#' + col.getHexString() + ';color:#' + col.getHexString() + ';font-size:10px;border:2px solid #' + col2.getHexString() + ';padding-right:' + fontSize + 'px')

    const max = this._line.length
    this._temp.push({
      mx:mx,
      h:h
    })
    if(this._temp.length > max) {
      this._temp.shift()
    }

    // 画面出力
    const sw = Func.instance.sw()
    const sh = Func.instance.sh()

    const len = this._line.length
    const itemW = sw * 0.8
    const itemH = (sh * 0.8) / len
    this._line.forEach((val,i) => {
      const temp = this._temp[Math.min(i, this._temp.length - 1)]
      const scaleX = Util.instance.map(temp.mx, 0.1, 1, 0, 1)
      val.scale.set(itemW * scaleX, itemH * 0.8, 1)
      val.position.x = itemW * scaleX * 0.5 - itemW * 0.5
      val.position.y = (i * -itemH) - itemH * 0.5 + (itemH * len * 0.5)

      // 色変更
      let h = temp.h

      let col = new Color('hsl(' + h + ', 100%, 50%)')
      let m = val.material as MeshBasicMaterial
      m.color = new Color(1 - col.r, 1 - col.g, 1 - col.b)

      const bg = this._bg[i]
      bg.scale.copy(val.scale)
      bg.position.copy(val.position)
      m = bg.material as MeshBasicMaterial
      m.color = col

    })

    if (this.isNowRenderFrame()) {
      this._render()
    }
  }


  private _render(): void {
    const bgColor = 0x000000
    this.renderer.setClearColor(bgColor, 1)
    this.renderer.render(this.mainScene, this.camera)
  }


  public isNowRenderFrame(): boolean {
    return this.isRender
  }


  _resize(isRender: boolean = true): void {
    super._resize();

    const w = Func.instance.sw();
    const h = Func.instance.sh();

    if(Conf.instance.IS_SP || Conf.instance.IS_TAB) {
      if(w == this.renderSize.width && this.renderSize.height * 2 > h) {
        return
      }
    }

    this.renderSize.width = w;
    this.renderSize.height = h;

    this.updateCamera(this.camera, w, h);

    let pixelRatio: number = window.devicePixelRatio || 1;

    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(w, h);
    this.renderer.clear();

    if (isRender) {
      this._render();
    }
  }
}
